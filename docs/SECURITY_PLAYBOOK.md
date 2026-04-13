# Security Playbook
### Per-Project Checklist, Key Rotation, and Incident Response

This document is a repeatable guide for securing every project deployed to the
Hetzner VPS. Use it as a checklist when launching new projects and as a runbook
when responding to security incidents.

---

## Per-Project Security Checklist

Run through this for every new project before it goes live.

### Infrastructure

- [ ] Container runs as non-root user (`USER appuser` in Dockerfile)
- [ ] `docker-compose.yml` includes `security_opt: [no-new-privileges:true]`
- [ ] `docker-compose.yml` includes `read_only: true` with explicit `tmpfs` mounts
- [ ] Container uses `healthcheck` directive
- [ ] No `ports:` exposed — traffic routes through Caddy only
- [ ] Service is on `proxy-net` network
- [ ] `.env` file exists on server only — never committed to Git
- [ ] `.env.example` committed with placeholder values

### Caddy (EventHorizon Caddyfile)

- [ ] Domain block added with `import security_headers`
- [ ] API routes use `reverse_proxy` with correct service name
- [ ] SSE/streaming routes include `flush_interval -1` and HTTP/1.1 transport
- [ ] No dead domains in Caddyfile (remove immediately when DNS is dropped)

### Application Code

- [ ] CORS limited to explicit origin allowlist (never `*`)
- [ ] API endpoints have rate limiting (10-20 req/min per IP)
- [ ] User input validated: max length, type checking, role validation
- [ ] No secrets hardcoded in frontend code (use env vars, no fallback values)
- [ ] No secrets in Dockerfiles or docker-compose.yml (use `env_file` or `${VAR}`)
- [ ] API docs disabled in production (`docs_url=None, redoc_url=None`)

### Monitoring

- [ ] UptimeRobot monitor added for the domain
- [ ] Google Search Console property added (once domain is verified)
- [ ] Docker healthcheck configured

---

## Security Headers Reference

All projects inherit these headers from the EventHorizon Caddyfile snippet:

```caddyfile
(security_headers) {
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "camera=(), microphone=(), geolocation=()"
        -Server
    }
}
```

| Header | Purpose |
|--------|---------|
| `Strict-Transport-Security` | Forces HTTPS for 1 year; browsers refuse HTTP |
| `X-Content-Type-Options` | Prevents MIME type sniffing attacks |
| `X-Frame-Options` | Blocks clickjacking (no iframes) |
| `Referrer-Policy` | Limits referrer info sent to other origins |
| `Permissions-Policy` | Disables camera, mic, geolocation APIs |
| `-Server` | Removes Caddy version header (anti-fingerprinting) |

---

## Key Rotation Procedures

### When to rotate

- Immediately if a key was ever displayed in a chat, log, or error message
- Immediately if a `.env` file was accidentally committed to Git
- Every 90 days as standard practice
- After any team member leaves or loses access

### Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com) -> API Keys
2. Create a new key
3. SSH to server: `ssh root@YOUR_SERVER_IP`
4. Edit: `nano /opt/portfolio/.env`
5. Replace `ANTHROPIC_API_KEY=sk-ant-OLD...` with the new key
6. Restart: `cd /opt/portfolio && docker compose up -d portfolio-api`
7. Delete the old key from console.anthropic.com
8. Verify: `curl -s https://aaronk.tech/api/health`

### EmailJS Keys

1. Go to [emailjs.com](https://emailjs.com) -> Account -> API Keys
2. Regenerate the public key
3. SSH to server
4. Edit: `nano /opt/portfolio/.env`
5. Update `REACT_APP_EMAILJS_SERVICE_ID`, `REACT_APP_EMAILJS_TEMPLATE_ID`, `REACT_APP_EMAILJS_PUBLIC_KEY`
6. Rebuild: `cd /opt/portfolio && docker compose up -d --build portfolio-app`

### SSH Keys

1. Generate new key locally: `ssh-keygen -t ed25519 -C "your@email.com"`
2. Copy to server: `ssh-copy-id -i ~/.ssh/id_ed25519.pub deploy@YOUR_SERVER_IP`
3. Test login with new key
4. Remove old key from `/home/deploy/.ssh/authorized_keys`

---

## Incident Response

### If Google Safe Browsing flags a domain

**Timeline: act within 1 hour of detection.**

1. **Identify the flag type** — go to:
   ```
   https://transparencyreport.google.com/safe-browsing/search?url=yourdomain.com
   ```

2. **Remove the offending content immediately**
   - AI chatbots, data collection forms, or anything that could look like phishing
   - Deploy a clean build: `git push && ssh deploy@SERVER "cd /opt/project && git pull && docker compose up -d --build"`

3. **Submit false positive report** (no account needed):
   ```
   https://safebrowsing.google.com/safebrowsing/report_error/?hl=en
   ```
   - URL: `http://yourdomain.com/`
   - Explain that the flagged content has been removed
   - Describe the site's legitimate purpose

4. **Submit via Google Search Console** (faster official path):
   - Go to [search.google.com/search-console](https://search.google.com/search-console)
   - Select the property -> Security & Manual Actions -> Security Issues
   - Click "Request Review"

5. **Contact the domain registry if suspended**
   - For `.tech` domains: https://abuse.radix.website/unsuspension
   - For `.com/.net`: contact your registrar
   - Explain the content has been removed, provide the false positive report confirmation

6. **Monitor resolution** — Google typically clears flags within 1-3 business days

### Template: False Positive Report

> "This domain hosts a personal developer portfolio website. It was recently
> flagged due to [describe feature, e.g. an AI chatbot]. This feature has been
> permanently removed. The site is now a static portfolio with no data collection,
> no forms requesting personal information, and no downloads. I am requesting
> manual review and delisting."

### Template: Registry Unsuspension Request

> "The domain [yourdomain.com] has been suspended due to a Google Safe Browsing
> flag. I have removed the offending content and submitted a delisting request
> to Google (reference: [date submitted]). The domain now hosts only static
> content with no harmful or deceptive elements. I request unsuspension so the
> domain can be restored while the Google review is processed."

---

## If a secret is exposed

1. **Rotate the key immediately** (see procedures above)
2. **Check Git history** — if committed, the key is in the history forever
   - Run: `git log --all --oneline -- .env` to check
   - If found: consider the key permanently compromised, rotate it
3. **Audit access logs** for unauthorized usage
4. **Update `.gitignore`** if the file type wasn't excluded
5. **Log the incident** in `docs/SECURITY_AUDIT_LOG.md`

---

## If the server is compromised

1. **Take a snapshot** via Hetzner console (for forensics)
2. **Change all passwords and keys** — SSH, API keys, database credentials
3. **Review Docker containers** — check for unknown containers: `docker ps -a`
4. **Check auth logs**: `journalctl -u ssh --since "1 hour ago"`
5. **Review open ports**: `ss -tlnp` — anything unexpected?
6. **Rebuild from scratch if uncertain** — Hetzner makes it easy to create a new server

---

## Monthly Security Maintenance

Run these on the 1st of every month:

```bash
# Update system packages
apt update && apt upgrade -y

# Rebuild all Docker images with latest base images
cd /opt/portfolio && docker compose pull && docker compose up -d --build
cd /opt/arbiter && docker compose pull && docker compose up -d --build
cd /opt/blockchain && docker compose pull && docker compose up -d --build

# Scan for container vulnerabilities
docker scout cves portfolio-portfolio-app 2>/dev/null || docker images --format "{{.Repository}}:{{.Tag}}"

# Audit open ports
ss -tlnp

# Check fail2ban status
fail2ban-client status sshd

# Review auth logs for unusual activity
journalctl -u ssh --since "30 days ago" | grep "Failed" | tail -20

# Check disk usage
df -h
docker system df
```

---

## UptimeRobot Setup (one-time)

1. Sign up at [uptimerobot.com](https://uptimerobot.com) (free tier: 50 monitors)
2. Add HTTP(S) monitors for each active domain:
   - `https://aaronk.tech`
   - `https://docs.aaronk.tech`
   - `https://arbiter.aaronk.tech`
   - `https://blockchain.aaronk.tech`
3. Set check interval to 5 minutes
4. Add alert contacts: email + SMS (optional)
5. Enable status page (optional — gives you a public URL to check uptime)

---

## Google Search Console Setup (one-time per domain)

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property -> Domain -> enter `aaronk.tech`
3. Verify via DNS TXT record at your registrar:
   - Type: `TXT`
   - Host: `@`
   - Value: (copy from Search Console)
4. Repeat for subdomains if needed
5. Go to Security & Manual Actions -> enable email notifications
6. This gives early warning of any future Safe Browsing flags
