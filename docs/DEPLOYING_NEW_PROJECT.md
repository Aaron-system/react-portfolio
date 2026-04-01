# Deploying a New Project to aaronk.tech (Hetzner VPS)

Full step-by-step guide for adding any new project — frontend, backend, or both —
to the existing Hetzner VPS and making it accessible via a subdomain of `aaronk.tech`.

---

## Architecture overview

```
Internet
   │
   ▼
Caddy (eventhorizon-caddy-1)          ← single entry point, handles TLS
   │  port 80 / 443
   ├─▶ aaronk.tech          → portfolio-app container  (port 3002)
   ├─▶ docs.aaronk.tech     → eventhorizon-frontend    (port 3000)
   ├─▶ arbiter.aaronk.tech  → arbiter-frontend         (port 3001)
   ├─▶ blockchain.aaronk.tech → blockchain-frontend    (port XXXX)
   └─▶ [new].aaronk.tech    → your-new-app container   (port XXXX)

All containers share the Docker network:  proxy-net
Caddy container lives in:               /opt/eventHorizon/
```

---

## Part 1 — DNS: point the subdomain at the server

Do this first. TLS cert issuance depends on DNS being correct.

1. Log in to your domain registrar (Namecheap / Cloudflare / etc.)
2. Go to the DNS management for `aaronk.tech`
3. Add an **A record**:

   | Type | Host | Value | TTL |
   |------|------|-------|-----|
   | A | `newproject` | `204.168.177.22` | Automatic |

   This makes `newproject.aaronk.tech` resolve to the VPS.

4. Wait 2–10 minutes for DNS to propagate before continuing.

Verify with:
```bash
nslookup newproject.aaronk.tech
# Should return: 204.168.177.22
```

---

## Part 2 — Project structure on the server

SSH into the server:
```bash
ssh root@204.168.177.22
```

Create a folder for the project:
```bash
mkdir /opt/newproject
cd /opt/newproject
```

### Option A — Clone from GitHub
```bash
git clone https://github.com/Aaron-system/your-repo.git .
```

### Option B — Copy files from local machine (run from Windows PowerShell)
```powershell
scp -r C:\portfolio\your-project\* root@204.168.177.22:/opt/newproject/
```

---

## Part 3 — Docker setup for the new project

### 3a. Create a `Dockerfile`

**React / Next.js frontend:**
```dockerfile
# Stage 1: build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: serve with Caddy
FROM caddy:2-alpine
COPY --from=build /app/build /srv
COPY Caddyfile /etc/caddy/Caddyfile
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

### 3b. Create a `Caddyfile` (for frontend containers only)

```caddyfile
:3001 {
    root * /srv
    file_server
    try_files {path} /index.html
}
```

Change the port number (`:3001`) to something not already in use.
Current used ports: `3000` (eventHorizon), `3002` (portfolio).

### 3c. Create a `docker-compose.yml`

```yaml
networks:
  proxy-net:
    external: true
    name: proxy-net

services:
  newproject-frontend:
    build: .
    restart: unless-stopped
    networks:
      - proxy-net

  # Include this only if you have a backend:
  newproject-backend:
    build: ./backend
    restart: unless-stopped
    environment:
      - DATABASE_URL=...
      - FRONTEND_ORIGIN=https://newproject.aaronk.tech
    networks:
      - proxy-net
```

**Key rules:**
- Every service must be on `proxy-net` so Caddy can reach it by container name
- Do NOT expose ports with `ports:` — Caddy routes to them internally
- The service name in `docker-compose.yml` becomes the hostname Caddy uses
  (e.g. `newproject-frontend:3001`)

---

## Part 4 — Build and start the container

```bash
cd /opt/newproject
docker compose up -d --build
```

Verify it started:
```bash
docker ps
# You should see your new container with status "Up"
```

---

## Part 5 — Add the subdomain to Caddy

The Caddy config lives at `/opt/eventHorizon/Caddyfile`.
Add a new block for your project:

```bash
nano /opt/eventHorizon/Caddyfile
```

### Frontend only
```caddyfile
newproject.aaronk.tech {
    reverse_proxy newproject-frontend:3001
}
```

### Frontend + Backend (with API)
```caddyfile
newproject.aaronk.tech {
    handle /api/* {
        reverse_proxy newproject-backend:8000
    }
    handle /socket.io/* {
        reverse_proxy newproject-backend:8000
    }
    handle {
        reverse_proxy newproject-frontend:3001
    }
}
```

Save and exit (`Ctrl+O`, `Ctrl+X` in nano).

---

## Part 6 — Reload Caddy

```bash
cd /opt/eventHorizon
docker compose -f docker-compose.yml -f docker-compose.proxy-net.yml exec caddy \
  caddy reload --config /etc/caddy/Caddyfile
```

Caddy will automatically:
- Request a Let's Encrypt TLS certificate for `newproject.aaronk.tech`
- Start routing traffic to your container
- Renew certificates automatically before expiry

Verify the cert was issued:
```bash
docker compose -f docker-compose.yml -f docker-compose.proxy-net.yml logs caddy --tail=20
# Look for: "certificate obtained successfully" for your domain
```

---

## Part 7 — Add the link to the portfolio

Edit `src/components/Home/Portfolio/index.js` on your local machine:

```js
const featuredProjects = [
    // ... existing projects ...
    {
        title: 'My New Project',
        category: 'Python · FastAPI · React',
        image: '/newproject.png',          // put screenshot in /public/
        link: 'https://newproject.aaronk.tech',
    },
];
```

Add the screenshot to `C:\portfolio\react-portfolio\public\newproject.png`

Then deploy the portfolio:
```powershell
cd C:\portfolio\react-portfolio
git add -A
git commit -m "Add new project card: My New Project"
git push origin master

ssh root@204.168.177.22 "cd /opt/portfolio && git pull origin master && docker compose up -d --build"
```

---

## Part 8 — Environment variables

For projects with secrets (API keys, DB URLs etc.), do NOT put them in
`docker-compose.yml`. Use an env file instead.

Create `/opt/newproject/.env` on the server:
```bash
nano /opt/newproject/.env
```

```env
DATABASE_URL=postgresql://user:pass@host/dbname
OPENAI_API_KEY=sk-...
FRONTEND_ORIGIN=https://newproject.aaronk.tech
```

Reference it in `docker-compose.yml`:
```yaml
services:
  newproject-backend:
    env_file:
      - .env
```

`.env` files are never committed to git — keep them only on the server.

---

## Quick reference — current projects on server

| Subdomain | Container name | Port | Folder |
|-----------|---------------|------|--------|
| `aaronk.tech` | `portfolio-portfolio-app` | 3002 | `/opt/portfolio` |
| `docs.aaronk.tech` | `eventhorizon-frontend` | 3000 | `/opt/eventHorizon` |
| `arbiter.aaronk.tech` | `arbiter-frontend` | 3001 | `/opt/arbiter` (TBC) |
| `blockchain.aaronk.tech` | `blockchain-frontend` | 3003 | `/opt/blockchain` (TBC) |
| `[new].aaronk.tech` | `[new]-frontend` | 3004+ | `/opt/[new]` |

---

## Troubleshooting

### Site shows ERR_SSL_PROTOCOL_ERROR
Caddy hasn't got the cert yet. Either:
- DNS hasn't propagated — wait and retry
- Caddy config has a typo — check with `caddy reload` output

### Site shows 502 Bad Gateway
Caddy can reach the domain but your container isn't responding.
- Check container is running: `docker ps`
- Check logs: `docker logs <container-name>`
- Verify service name in Caddyfile matches the name in docker-compose.yml exactly

### Container won't start
```bash
cd /opt/newproject
docker compose logs
```
Common causes: wrong port, missing env var, build failure.

### Caddy reload fails
```bash
docker compose -f /opt/eventHorizon/docker-compose.yml \
  -f /opt/eventHorizon/docker-compose.proxy-net.yml \
  exec caddy caddy validate --config /etc/caddy/Caddyfile
```
This validates the config without reloading — shows exact syntax errors.

---

## Full commands cheat sheet

```bash
# SSH into server
ssh root@204.168.177.22

# Start / rebuild a project
cd /opt/newproject && docker compose up -d --build

# Reload Caddy after Caddyfile change
cd /opt/eventHorizon && docker compose -f docker-compose.yml -f docker-compose.proxy-net.yml exec caddy caddy reload --config /etc/caddy/Caddyfile

# View all running containers
docker ps

# View logs for a container
docker logs <container-name> --tail=50

# Restart a single container
docker compose restart <service-name>

# Stop a project
cd /opt/newproject && docker compose down

# Pull latest code and rebuild
cd /opt/newproject && git pull origin master && docker compose up -d --build
```
