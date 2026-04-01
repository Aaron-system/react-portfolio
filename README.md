# Aaron Kreidieh — Portfolio

Personal portfolio built with React, showcasing my work in legal tech, AI systems, simulations, and full-stack development.

**Live site:** [aaronk.tech](https://aaronk.tech)

---

## About

I'm a legal software engineer and self-taught full-stack developer combining a Law & Commerce (Accounting) degree with hands-on AI engineering. I build production systems at the intersection of law and machine learning — contract analysis platforms, retrieval-augmented generation pipelines, and legal workflow automation.

---

## Features

- **Interactive pixel avatar** — walk a character across a city of interests (Legal AI, Simulations, Blockchain, Robotics) with keyboard and tap-to-move controls
- **AI chatbot panel** — context-aware terminal that responds based on the avatar's current zone
- **Experience timeline** — detailed career log with animated scroll indicator
- **Project cards** — live screenshots of production projects with hover parallax
- **Responsive design** — mobile-first with bottom navigation on small screens
- **EmailJS contact form** — live form delivery to Gmail

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 (Create React App) |
| Styling | SCSS modules |
| Routing | React Router v6 |
| Animation | CSS keyframes, requestAnimationFrame |
| Icons | Font Awesome |
| Email | EmailJS |
| Maps | React Leaflet |
| Fonts | Coolvetica, La Belle Aurore, Helvetica Neue |
| Deployment | Docker + Caddy on Hetzner VPS |

---

## Projects Featured

| Project | Description |
|---------|-------------|
| **AI Document Builder** | Production contract analysis platform for construction law — clause extraction, risk identification, compliance review |
| **Multi Legal AI Assistant** | Legal research assistant with semantic search across case law using vector indexes |
| **Neural Network Tribe Simulation** | Agent-based hunter-gatherer simulation using reinforcement learning and emergent behaviour |
| **Flask Blockchain** | Blockchain implementation with Solidity smart contracts and a Python/Flask API |

---

## Running Locally

```bash
git clone https://github.com/Aaron-system/react-portfolio.git
cd react-portfolio
npm install
npm start
```

App runs at `http://localhost:3000`.

---

## Deployment

Deployed to a Hetzner VPS using Docker + Caddy as a reverse proxy shared across multiple projects.

```bash
# Build and start
docker compose up -d --build
```

The `Caddyfile` serves the built React app on internal port `3002`. The edge Caddy (from the EventHorizon stack) routes `aaronk.tech` to this container over the shared `proxy-net` Docker network.

See [`docs/17-portfolio-domain-setup.md`](../eventhorizon/docs/17-portfolio-domain-setup.md) for the full deployment guide.

---

## Environment Variables

EmailJS credentials can be overridden with environment variables (optional — defaults are hardcoded for the free tier):

```env
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## Contact

**Aaron Kreidieh**
Sydney, Australia
[aaron.kreidieh@gmail.com](mailto:aaron.kreidieh@gmail.com)
[LinkedIn](https://www.linkedin.com/in/aaron-kreidieh-1383391ab/) · [GitHub](https://github.com/Aaron-system)
