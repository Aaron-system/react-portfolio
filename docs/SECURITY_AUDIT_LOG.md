# Security Audit Log

Track every security change made to the infrastructure. Date each entry.
Use this as a template for each new project.

---

## 2026-04-09 — Full Security Hardening (Post-Incident)

**Trigger:** Google Safe Browsing flagged `aaronk.tech` as phishing due to an
AI chatbot feature. The `.tech` domain registry (Radix) suspended the domain.

### Phase 1 — Application Code Fixes

| Change | File | Detail |
|--------|------|--------|
| Fix CORS wildcard | `portfolio-api/main.py` | `allow_origins=["*"]` changed to explicit `["https://aaronk.tech", "https://www.aaronk.tech"]` via `ALLOWED_ORIGINS` env var |
| Add rate limiting | `portfolio-api/main.py` | In-memory rate limiter: 10 requests/minute per IP on `/api/chat` |
| Add input validation | `portfolio-api/main.py` | Max 2000 chars per message, max 20 messages, role must be `user` or `assistant` |
| Disable API docs | `portfolio-api/main.py` | `docs_url=None, redoc_url=None` on FastAPI app |
| Remove hardcoded EmailJS keys | `src/components/Contact/index.js` | Removed `|| 'service_...'` fallback values; now reads from `REACT_APP_*` env vars only |
| Add `.env.example` | `.env.example` | Template file with placeholder values for all required env vars |
| Build args for EmailJS | `Dockerfile`, `docker-compose.yml` | EmailJS keys passed as `ARG` during Docker build |

### Phase 2 — Infrastructure Hardening

| Change | Location | Detail |
|--------|----------|--------|
| Create deploy user | Server | `adduser deploy`, added to `docker` group, SSH key copied |
| Disable root SSH login | `/etc/ssh/sshd_config` | `PermitRootLogin prohibit-password` |
| Disable password auth | `/etc/ssh/sshd_config` | `PasswordAuthentication no` |
| Enable UFW firewall | Server | Allow 22/tcp, 80/tcp, 443/tcp, 443/udp. Default deny incoming. |
| Remove dead domain | EventHorizon Caddyfile | Removed `horizonlegaldocs.online` block (no DNS, causing cert retry noise) |

### Phase 3 — Application Hardening

| Change | Location | Detail |
|--------|----------|--------|
| Security headers | EventHorizon Caddyfile | Added `(security_headers)` snippet with HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, -Server |
| Security headers (internal) | Portfolio `Caddyfile` | Same headers added to internal Caddy serving on :3002 |
| Headers applied to all domains | EventHorizon Caddyfile | `import security_headers` in every domain block |
| Docker security options | `docker-compose.yml` | `no-new-privileges:true`, `read_only: true`, `tmpfs` mounts |
| Non-root containers | `portfolio-api/Dockerfile` | Added `appuser` via `adduser`, set `USER appuser` |
| Docker healthchecks | `docker-compose.yml` | HTTP healthchecks on both `portfolio-app` and `portfolio-api` |

### Phase 4 — Monitoring (requires manual setup)

| Change | Location | Detail |
|--------|----------|--------|
| UptimeRobot | uptimerobot.com | Add HTTP monitors for all active domains |
| Google Search Console | search.google.com/search-console | Add property, verify via DNS TXT, enable security alerts |

### Phase 5 — Documentation

| Document | Purpose |
|----------|---------|
| `docs/SECURITY_PLAYBOOK.md` | Per-project checklist, key rotation procedures, incident response runbook |
| `docs/SECURITY_AUDIT_LOG.md` | This file — dated log of all security changes |

---

## Pending Actions (require manual intervention)

- [ ] Rotate Anthropic API key at console.anthropic.com, update `/opt/portfolio/.env`
- [ ] Sign up at uptimerobot.com, add monitors for all domains
- [ ] Once domain unsuspended: add Google Search Console TXT record, verify, enable alerts
- [ ] Submit Google Safe Browsing false positive report
- [ ] Reply to Radix with confirmation of delisting request

---

## Template — New Audit Entry

Copy this when making future security changes:

```markdown
## YYYY-MM-DD — [Brief description]

**Trigger:** [What prompted this change]

| Change | Location | Detail |
|--------|----------|--------|
| ... | ... | ... |
```
