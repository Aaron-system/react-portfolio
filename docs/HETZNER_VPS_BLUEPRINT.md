# Hetzner VPS Deployment Blueprint
### Hosting Multiple Projects Under One Server — A Complete Guide

This is a full blueprint for replicating the multi-project hosting setup used at `aaronk.tech`.
It covers everything from buying a server to going live, with explanations for *why* each
decision was made and the security implications of each choice.

---

## What This Guide Builds

By the end you will have:

- A single VPS (Virtual Private Server) running on Hetzner
- One master reverse proxy (Caddy) that handles **all** traffic, SSL/TLS, and routing
- Multiple independent projects — React frontends, Python/FastAPI backends, Node APIs —
  each in their own Docker container
- Every project accessible at its own domain or subdomain with automatic HTTPS
- A workflow for deploying code changes in under 60 seconds from your local machine

The real setup this is based on:

```
Internet (browser)
       │
       ▼ port 80 / 443
  ┌─────────────────────────────────────────────────────┐
  │  Caddy (master reverse proxy)                       │
  │  /opt/eventHorizon/                                 │
  │                                                     │
  │  horizonlegaldocs.online ──► frontend:3000          │
  │                         ──► backend:8001            │
  │                                                     │
  │  docs.aaronk.tech       ──► frontend:3000          │
  │                         ──► backend:8001            │
  │                                                     │
  │  aaronk.tech            ──► portfolio-app:3002      │
  │                         ──► portfolio-api:8000      │
  │                                                     │
  │  arbiter.aaronk.tech    ──► arbiter-frontend:3001  │
  │                         ──► arbiter-backend:8000    │
  │                                                     │
  │  blockchain.aaronk.tech ──► blockchain-frontend     │
  │  blockchain-node.aaronk.tech ──► blockchain-node   │
  └─────────────────────────────────────────────────────┘
       │
       ▼  internal Docker network: proxy-net
  All project containers (no exposed ports)
```

Every container is on the same private Docker network (`proxy-net`). Nothing is exposed
to the internet directly except Caddy on ports 80 and 443.

---

## Prerequisites (What You Need Before Starting)

| Item | Details |
|------|---------|
| A domain name | e.g. `yourdomain.com` — buy from Namecheap, Cloudflare, or Porkbun (~$10/yr) |
| A Hetzner account | hetzner.com — pay-as-you-go, no long-term contract |
| Git installed locally | https://git-scm.com |
| SSH client | Built into Windows 10+, macOS, Linux |
| Docker Desktop (optional) | For testing containers locally before deploying |
| A GitHub/GitLab account | For storing project code |

---

## Part 1 — Buy and Configure the Hetzner Server

### 1.1 Choose a server

1. Log in to https://console.hetzner.cloud
2. Click **New Project** → name it (e.g. `myprojects`)
3. Click **Add Server**
4. Choose:
   - **Location:** whichever is closest to your users (e.g. Ashburn US, Falkenstein EU)
   - **Image:** Ubuntu 24.04 (LTS — Long Term Support, most stable)
   - **Type:** CX22 (~€4/month) for hobby projects; CX32 (~€8/month) if running 5+ apps
   - **SSH Keys:** click "Add SSH Key" — paste your public key (see 1.2 below)
   - **Backups:** enable for €0.80/month — worth it
5. Click **Create & Buy Now**

Your server will be ready in ~30 seconds. Note down the **IP address** shown (e.g. `204.168.177.22`).

### 1.2 Set up SSH keys (if you haven't already)

On your local machine (PowerShell on Windows, Terminal on Mac/Linux):

```bash
# Generate a key pair (press Enter for all prompts to use defaults)
ssh-keygen -t ed25519 -C "your@email.com"

# Show your PUBLIC key to paste into Hetzner
cat ~/.ssh/id_ed25519.pub
```

Copy the output — it starts with `ssh-ed25519 AAAA...`. Paste this into Hetzner when creating the server.

> **Why SSH keys?** SSH keys are cryptographically stronger than passwords. Anyone who
> finds your server's IP cannot brute-force in because they'd need the private key file
> from your machine. Never share your private key (`id_ed25519` — no `.pub`).

### 1.3 Connect to the server

```bash
# Windows
& "C:\Windows\System32\OpenSSH\ssh.exe" root@YOUR_SERVER_IP

# Mac / Linux
ssh root@YOUR_SERVER_IP
```

You're now inside the server as `root`. Everything from here runs on the server unless
noted otherwise.

### 1.4 Basic server hardening (do this immediately)

```bash
# Update all system packages
apt update && apt upgrade -y

# Install fail2ban — automatically bans IPs that fail SSH login repeatedly
apt install -y fail2ban

# Start it and make it run on reboot
systemctl enable fail2ban
systemctl start fail2ban
```

> **Why fail2ban?** Within minutes of your server being online, bots will start hammering
> port 22 (SSH) trying common username/password combinations. fail2ban detects this and
> automatically bans those IPs for a configurable time.

---

## Part 2 — Install Docker

Docker lets you package each project into an isolated container. The server runs containers
instead of raw processes — meaning projects can't interfere with each other.

```bash
# Install Docker via the official install script
curl -fsSL https://get.docker.com | sh

# Verify it works
docker --version
docker compose version
```

Expected output: `Docker version 26.x.x` and `Docker Compose version v2.x.x`

> **Why Docker?** Without Docker, you'd need to install Node.js, Python, databases, etc.
> directly on the server, where they can conflict with each other and are hard to update
> or roll back. Docker gives each project its own isolated environment.

---

## Part 3 — Create the Shared Docker Network

All containers that need to talk to each other (or be reached by the Caddy proxy) must
be on the same Docker network. Create it once:

```bash
docker network create proxy-net
```

This creates a private internal network called `proxy-net`. Containers on this network
can reach each other by their **service name** (e.g. `portfolio-app`, `backend`).
Nothing outside Docker can reach them unless Caddy (which is also on `proxy-net`) routes
traffic to them.

> **Why a shared network?** Docker containers are isolated by default. Creating a named
> network lets you attach containers from *different* `docker-compose.yml` files to the
> same network, so Caddy (in `/opt/eventHorizon`) can route traffic to your portfolio app
> (in `/opt/portfolio`) even though they live in different project folders.

---

## Part 4 — Set Up the Master Caddy Reverse Proxy

This is the most important part. Caddy is the single entry point for all traffic.
It handles TLS certificates automatically and routes requests to the right container.

### 4.1 Create the EventHorizon folder

```bash
mkdir /opt/eventHorizon
cd /opt/eventHorizon
```

### 4.2 Create `Caddyfile`

This is Caddy's configuration file. Each block is one website/domain.

```bash
nano /opt/eventHorizon/Caddyfile
```

Start with just your first domain — you'll add more later:

```caddyfile
# Redirect www to non-www
www.yourdomain.com {
    redir https://yourdomain.com{uri} permanent
}

# Your first project
yourdomain.com {
    reverse_proxy myapp-frontend:3000
}
```

> **Caddy handles TLS automatically.** As soon as a domain block exists and DNS points
> to your server, Caddy will request a free Let's Encrypt certificate and renew it every
> 60 days. You never touch a certificate manually.

### 4.3 Create `docker-compose.yml`

```bash
nano /opt/eventHorizon/docker-compose.yml
```

```yaml
services:
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"     # HTTP/3 (QUIC)
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config

volumes:
  caddy_data:    # Stores TLS certificates (persists across restarts)
  caddy_config:  # Stores Caddy runtime config
```

> **Why named volumes for caddy_data?** If Caddy loses its certificate storage, it
> requests new certificates every restart. Let's Encrypt rate-limits this to 5 per domain
> per week. Named volumes persist the certs even when the container is recreated.

### 4.4 Create `docker-compose.proxy-net.yml`

This overlay file connects Caddy to the shared `proxy-net` network:

```bash
nano /opt/eventHorizon/docker-compose.proxy-net.yml
```

```yaml
networks:
  proxy-net:
    external: true
    name: proxy-net

services:
  caddy:
    networks:
      - default
      - proxy-net
```

> **Why two compose files?** Separating the network overlay means you can run Caddy
> with just its own services (`docker-compose.yml`) during initial testing, then add
> the proxy network with the overlay. It keeps concerns clean.

### 4.5 Start Caddy

```bash
cd /opt/eventHorizon
docker compose -f docker-compose.yml -f docker-compose.proxy-net.yml up -d
```

Verify it's running:
```bash
docker ps
# Should show: eventhorizon-caddy-1   caddy:2-alpine   Up X seconds
```

---

## Part 5 — DNS Setup

Before a project can go live, DNS must point your domain at the server.

### 5.1 Log in to your domain registrar

For each domain or subdomain you want to host:

1. Go to your registrar's DNS management (e.g. Namecheap → Domain List → Manage → Advanced DNS)
2. Add an **A record**:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | `@` (root domain) | `YOUR_SERVER_IP` | Automatic |
| A | `www` | `YOUR_SERVER_IP` | Automatic |
| A | `docs` | `YOUR_SERVER_IP` | Automatic |
| A | `arbiter` | `YOUR_SERVER_IP` | Automatic |

All subdomains point to the **same IP** — the same server. Caddy reads the `Host` header
of each incoming request to know which block to route it to.

### 5.2 Wait for DNS propagation

```bash
# On your local machine — test if DNS has propagated
nslookup yourdomain.com
# Expected: Non-authoritative answer: Address: YOUR_SERVER_IP

# Or
ping yourdomain.com
```

DNS propagation typically takes 2–10 minutes but can take up to 48 hours in rare cases.
Only proceed to TLS steps once DNS resolves correctly.

> **Why DNS must come first:** Caddy proves domain ownership by having Let's Encrypt
> make an HTTP request to your domain on port 80. If DNS isn't pointing at your server
> yet, that request fails and no certificate is issued.

---

## Part 6 — Deploy Your First Project

### 6.1 Project structure on the server

Each project lives in its own folder under `/opt/`:

```
/opt/
├── eventHorizon/     ← Master Caddy proxy (the "hub")
├── portfolio/        ← React portfolio + FastAPI backend
├── arbiter/          ← Arbiter Legal AI
├── blockchain/       ← Flask Blockchain
└── yourproject/      ← Your new project
```

```bash
mkdir /opt/yourproject
cd /opt/yourproject
```

### 6.2 Get your code onto the server

**Option A — Clone from GitHub (recommended):**
```bash
git clone https://github.com/yourusername/your-repo.git .
```

**Option B — Copy from your local machine** (run this on your local machine, not the server):
```powershell
# Windows PowerShell
scp -r C:\path\to\project\* root@YOUR_SERVER_IP:/opt/yourproject/
```

### 6.3 Write a Dockerfile

**React / Next.js frontend (builds a static site, served by Caddy):**

```dockerfile
# Stage 1: Build the React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci                    # Installs exact versions from package-lock.json
COPY . .
RUN npm run build             # Outputs to /app/build

# Stage 2: Serve with Caddy (tiny image, ~40MB total)
FROM caddy:2-alpine
COPY --from=build /app/build /srv
COPY Caddyfile /etc/caddy/Caddyfile
```

The `Caddyfile` for the frontend container (not the master one — this is internal):

```caddyfile
:3000 {
    root * /srv
    file_server
    try_files {path} /index.html   # Makes React Router work
}
```

**Python / FastAPI backend:**

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

> **Why `--host 0.0.0.0`?** By default uvicorn only listens on `127.0.0.1` (localhost
> inside the container). Binding to `0.0.0.0` makes it reachable from other containers
> on the Docker network. It is NOT exposed to the internet — only to `proxy-net`.

### 6.4 Write `docker-compose.yml`

```yaml
networks:
  proxy-net:
    external: true
    name: proxy-net

services:
  myapp-frontend:
    build: .
    restart: unless-stopped
    networks:
      - proxy-net
    # No "ports:" here — Caddy reaches it internally

  myapp-backend:
    build: ./backend
    restart: unless-stopped
    env_file:
      - .env                   # Secrets file, never committed to Git
    networks:
      - proxy-net
```

**Key rules:**
- Every service must join `proxy-net`
- **Never use `ports:` to expose services** — doing so makes them accessible on the
  public internet, bypassing Caddy and your HTTPS setup entirely
- The service name (`myapp-frontend`) becomes the hostname Caddy uses to route traffic

### 6.5 Build and start the containers

```bash
cd /opt/yourproject
docker compose up -d --build
```

Flags explained:
- `-d` — detached (runs in background)
- `--build` — rebuilds the Docker image from the Dockerfile

```bash
# Verify containers are up
docker ps

# Check logs if something isn't starting
docker compose logs --tail=50
```

---

## Part 7 — Add the Domain to Caddy

Now tell the master Caddy proxy about your new project.

```bash
nano /opt/eventHorizon/Caddyfile
```

Add a new block. Examples:

**Frontend only:**
```caddyfile
myapp.yourdomain.com {
    reverse_proxy myapp-frontend:3000
}
```

**Frontend + Backend with API routes:**
```caddyfile
myapp.yourdomain.com {
    handle /api/* {
        reverse_proxy myapp-backend:8000
    }
    handle {
        reverse_proxy myapp-frontend:3000
    }
}
```

**Frontend + Backend + WebSockets:**
```caddyfile
myapp.yourdomain.com {
    handle /api/* {
        reverse_proxy myapp-backend:8000
    }
    handle /socket.io/* {
        reverse_proxy myapp-backend:8000
    }
    handle {
        reverse_proxy myapp-frontend:3000
    }
}
```

**Frontend + Backend with Server-Sent Events (SSE / streaming AI):**

SSE streaming requires HTTP/1.1 — HTTP/3 (QUIC) breaks it. Use this pattern:

```caddyfile
myapp.yourdomain.com {
    @sse path /api/*
    handle @sse {
        header -alt-svc           # Stops browser upgrading to HTTP/3 for API calls
        header -Upgrade
        reverse_proxy myapp-backend:8000 {
            flush_interval -1     # Flush each chunk immediately (required for streaming)
            transport http {
                versions 1.1      # Force HTTP/1.1 between Caddy and backend
            }
        }
    }
    handle {
        reverse_proxy myapp-frontend:3000
    }
}
```

### Reload Caddy (no downtime)

```bash
cd /opt/eventHorizon
docker compose -f docker-compose.yml -f docker-compose.proxy-net.yml exec caddy \
  caddy reload --config /etc/caddy/Caddyfile
```

Caddy reloads without dropping any active connections. It will automatically request
a TLS certificate for the new domain within a few seconds.

Verify the certificate was issued:
```bash
docker compose -f docker-compose.yml -f docker-compose.proxy-net.yml logs caddy --tail=20
# Look for: "certificate obtained successfully"
```

---

## Part 8 — Secrets and Environment Variables

Never put API keys, database passwords, or other secrets in:
- Your `docker-compose.yml` (it goes to Git)
- Your source code
- Your Dockerfile

### The right way: `.env` files on the server only

```bash
nano /opt/yourproject/.env
```

```env
DATABASE_URL=postgresql://user:strongpassword@host:5432/dbname
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_live_...
FRONTEND_ORIGIN=https://myapp.yourdomain.com
```

Reference it in `docker-compose.yml`:
```yaml
services:
  myapp-backend:
    env_file:
      - .env
```

Add `.env` to your `.gitignore` (this should already be there for most frameworks):
```bash
echo ".env" >> .gitignore
```

> **Critical:** If you accidentally commit a secret to GitHub, consider it compromised.
> Rotate (regenerate) the key immediately. GitHub scans public repos for common secret
> patterns and will alert you, but the damage may already be done if the repo was public
> even briefly.

### Real example — the portfolio API key setup

The portfolio has an Anthropic API key for the AI chatbot. In the portfolio's
`docker-compose.yml`:
```yaml
services:
  portfolio-api:
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
```

The `${ANTHROPIC_API_KEY}` reads from the server's `/opt/portfolio/.env` file.
The `.env` file lives only on the server — never in Git.

---

## Part 9 — Deployment Workflow (Day-to-Day)

Once set up, the workflow for pushing a code change is:

**From your local machine:**
```bash
# 1. Commit and push to GitHub
git add -A
git commit -m "Describe what changed"
git push origin master

# 2. SSH to server and pull + rebuild
ssh root@YOUR_SERVER_IP "cd /opt/yourproject && git pull && docker compose up -d --build"
```

The Docker build uses layer caching — if `package.json` hasn't changed, `npm install`
is skipped. A typical rebuild takes 20–45 seconds.

**Rebuilding only one service (when you have frontend + backend):**
```bash
ssh root@YOUR_SERVER_IP "cd /opt/yourproject && git pull && docker compose up -d --build myapp-frontend"
```

**Checking what's running:**
```bash
ssh root@YOUR_SERVER_IP "docker ps"
```

---

## Part 10 — Security: What This Setup Gets Right and What to Watch

### What this setup gets right

| Protection | How it's achieved |
|-----------|-------------------|
| **HTTPS everywhere** | Caddy handles TLS automatically; HTTP redirects to HTTPS |
| **No exposed ports** | Only ports 80/443 are open; all containers communicate internally |
| **Container isolation** | Each project runs in its own container; a crash in one won't affect others |
| **Secrets not in Git** | `.env` files stay on server only |
| **Brute-force protection** | fail2ban blocks repeated failed SSH logins |
| **SSH key auth** | No password login needed for SSH |

### Additional security steps to consider

#### Disable password SSH login

Edit `/etc/ssh/sshd_config` on the server:
```bash
nano /etc/ssh/sshd_config
```

Find and set:
```
PasswordAuthentication no
PermitRootLogin prohibit-password
```

Restart SSH:
```bash
systemctl restart sshd
```

> **Warning:** Only do this after confirming your SSH key works. If you lock yourself
> out, you can use Hetzner's web console to recover access.

#### Set up a firewall (UFW)

```bash
apt install -y ufw

# Allow SSH first (or you'll lock yourself out)
ufw allow 22/tcp

# Allow web traffic
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp   # HTTP/3

# Enable the firewall
ufw enable

# Verify
ufw status
```

> **Critical:** Always allow port 22 BEFORE enabling UFW. If you block SSH, the only
> recovery is Hetzner's web console.

#### Keep Docker images updated

Old Docker base images contain known vulnerabilities. Periodically rebuild:
```bash
cd /opt/yourproject
docker compose pull       # Pull latest base images
docker compose up -d --build
```

#### Do not run as root long-term

Running everything as `root` is convenient during setup but is a security risk.
For production projects, create a dedicated user:

```bash
adduser deploy
usermod -aG docker deploy
# Copy your SSH key to the new user
mkdir /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
```

Then SSH as `deploy` instead of `root`.

#### Audit what's exposed

Periodically verify only ports 80, 443, and 22 are listening:
```bash
ss -tlnp
```

Any port you didn't intentionally open is a potential attack surface.

### What this setup does NOT protect against

| Risk | Mitigation |
|------|-----------|
| **Application-level vulnerabilities** | SQL injection, XSS, etc. — these are in your code, not the infrastructure |
| **Compromised API keys** | Rotate keys regularly; use least-privilege keys where possible |
| **DDoS** | Hetzner has basic DDoS protection; Cloudflare proxy adds more |
| **Data loss** | Enable Hetzner backups; back up databases separately |
| **Container escape** | Keep Docker updated; avoid running containers as root inside the container |

---

## Part 11 — Current Projects Reference (This Server)

| Domain | Container(s) | Folder | Port(s) |
|--------|-------------|--------|---------|
| `aaronk.tech` | `portfolio-app` + `portfolio-api` | `/opt/portfolio` | 3002 / 8000 |
| `horizonlegaldocs.online` | `frontend` + `backend` | `/opt/eventHorizon` | 3000 / 8001 |
| `docs.aaronk.tech` | `frontend` + `backend` | `/opt/eventHorizon` | 3000 / 8001 |
| `arbiter.aaronk.tech` | `arbiter-frontend` + `arbiter-backend` | `/opt/arbiter` | 3001 / 8000 |
| `blockchain.aaronk.tech` | `blockchain-frontend` | `/opt/blockchain` | 3000 |
| `blockchain-node.aaronk.tech` | `blockchain-node` | `/opt/blockchain` | 5001 |
| `blockchain-wallet.aaronk.tech` | `blockchain-wallet` | `/opt/blockchain` | 8081 |

---

## Part 12 — Troubleshooting

### Site shows `ERR_SSL_PROTOCOL_ERROR`
Caddy hasn't obtained the TLS certificate yet.
- Confirm DNS points to the server: `nslookup yourdomain.com`
- Check Caddy logs: `docker logs eventhorizon-caddy-1 --tail=30`
- Ensure port 80 is reachable (Let's Encrypt needs it for the challenge)

### Site shows `502 Bad Gateway`
Caddy can route to the domain but can't reach the container.
```bash
docker ps                           # Is the container actually running?
docker logs <container-name>        # Did it crash on startup?
```
Common causes:
- Service name in `Caddyfile` doesn't match service name in `docker-compose.yml`
- Container is on the wrong Docker network (must be on `proxy-net`)
- Container crashed (missing env var, bad port, startup error)

### Container won't start
```bash
cd /opt/yourproject
docker compose logs
```

### Caddy config has a syntax error
```bash
cd /opt/eventHorizon
docker compose -f docker-compose.yml -f docker-compose.proxy-net.yml exec caddy \
  caddy validate --config /etc/caddy/Caddyfile
```

### SSE / streaming not working (`ERR_QUIC_PROTOCOL_ERROR`)
Use the SSE-specific Caddyfile block from Part 7. The key directives are:
- `header -alt-svc` — prevents browser from upgrading to HTTP/3
- `flush_interval -1` — flushes each streamed chunk immediately
- `transport http { versions 1.1 }` — forces HTTP/1.1 between Caddy and backend

### Git pull on server shows "already up to date" but site is old
The container is running an old image. Force a rebuild:
```bash
docker compose up -d --build --force-recreate
```

---

## Quick Reference — Essential Commands

```bash
# SSH into server
ssh root@YOUR_SERVER_IP

# Deploy / rebuild a project
cd /opt/yourproject && git pull && docker compose up -d --build

# Rebuild a single service only
docker compose up -d --build myapp-frontend

# Reload Caddy after editing Caddyfile (no downtime)
cd /opt/eventHorizon
docker compose -f docker-compose.yml -f docker-compose.proxy-net.yml exec caddy \
  caddy reload --config /etc/caddy/Caddyfile

# View all running containers
docker ps

# View logs for a container
docker logs <container-name> --tail=50

# Follow logs in real time
docker logs <container-name> -f

# Stop a project (keeps data)
cd /opt/yourproject && docker compose down

# Stop and wipe volumes (destructive — deletes data)
docker compose down -v

# Shell inside a running container
docker exec -it <container-name> sh

# Free up disk space (remove unused images)
docker image prune -a

# View disk usage
df -h
docker system df
```

---

## Checklist — Adding a New Project

- [ ] DNS A record added and propagated (`nslookup` confirms correct IP)
- [ ] Project folder created at `/opt/yourproject/`
- [ ] Code cloned from GitHub or copied from local machine
- [ ] `Dockerfile` written and tested
- [ ] `docker-compose.yml` written with `proxy-net` network, no `ports:` exposed
- [ ] `.env` file created on server with all secrets (not committed to Git)
- [ ] `docker compose up -d --build` runs successfully
- [ ] `docker ps` shows container with status `Up`
- [ ] Caddyfile block added for the new domain/subdomain
- [ ] Caddy reloaded (`caddy reload`)
- [ ] TLS certificate issued (check Caddy logs)
- [ ] Site loads at `https://yourproject.yourdomain.com`
