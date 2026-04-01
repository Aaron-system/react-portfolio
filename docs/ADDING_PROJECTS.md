# Adding Projects to the Portfolio

This document tells a coding LLM exactly what to change to add or update a project
in Aaron Kreidieh's React portfolio (`aaronk.tech`). Read it fully before making
any edits.

---

## Repository layout (relevant files only)

```
react-portfolio/
├── public/                          ← Static assets served at the root URL
│   ├── HorizonLegal.png             ← Card image for Horizon Legal Docs
│   ├── arbiter.png                  ← Card image for Arbiter Legal AI
│   ├── blockchain.png               ← Card image for Flask Blockchain
│   ├── network_a38_t00400.png       ← Card image for Neural Network Sim
│   └── Aaron_Kreidieh_Resume_2026.docx
│
└── src/
    └── components/
        ├── Home/
        │   └── Portfolio/
        │       ├── index.js         ← Homepage project cards  ★ MAIN EDIT TARGET
        │       └── index.scss       ← Card styles (rarely needs changing)
        ├── Experience/
        │   ├── index.js             ← Experience page: roles / projects / services
        │   └── index.scss           ← Experience page styles
        └── About/
            └── content.js           ← Chatbot prompts and responses
```

---

## 1 — Homepage project cards (`src/components/Home/Portfolio/index.js`)

### How cards work

Cards are driven by the `featuredProjects` array near the top of the file.
Each object in the array renders one card in the 3-column grid.

```js
const featuredProjects = [
  {
    title: 'AI Document Builder',   // Large heading shown on the card
    category: 'Legal AI',           // Small label above the heading
    image: '/HorizonLegal.png',     // Path relative to /public — must start with /
    // Optional flags:
    blur: true,                     // Applies a blur + contrast filter (use for noisy images)
    placeholder: true,              // Adds "Coming Soon" badge and mutes the card
    link: 'https://example.com',    // (Future) External link when card is clicked
  },
];
```

### Current cards (do not remove these — only update them)

| Position | title | category | image |
|----------|-------|----------|-------|
| 1 | AI Document Builder | Legal AI | /HorizonLegal.png |
| 2 | Multi Legal AI Assistant | Legal AI / NLP | /arbiter.png |
| 3 | Neural Network Tribe Simulation | Python / ML | /network_a38_t00400.png |
| 4 | Flask Blockchain | Python / Web3 | /blockchain.png |

The Experience card (the 5th tile) is **not** in `featuredProjects` — it is
hardcoded below the `.map()` and navigates to `/experience` on click.
Do not remove or move it.

### How to update a card

Only edit the fields inside the relevant object inside `featuredProjects`.
Example — updating Horizon Legal Docs to add a link and better category:

```js
// BEFORE
{ title: 'AI Document Builder', category: 'Legal AI', image: '/HorizonLegal.png' },

// AFTER
{
  title: 'Horizon Legal Docs',
  category: 'Legal AI · Document Automation',
  image: '/HorizonLegal.png',
  link: 'https://horizonlegaldocs.online',
},
```

### How to add a new card

Append a new object to `featuredProjects`. The grid is 3 columns on desktop,
2 on tablet, 1 on mobile — it expands automatically.

```js
{
  title: 'My New Project',
  category: 'Python / FastAPI',
  image: '/my-screenshot.png',
},
```

Then add the image to `/public/my-screenshot.png`.

### Image guidelines

- Place images in `C:\portfolio\react-portfolio\public\` (Windows path)
- Reference them in code as `/filename.png` (no `public/` prefix)
- Recommended size: 800 × 1040 px (portrait, ~1.3 aspect ratio)
- If the image has thin aliased lines or render artefacts, add `blur: true`
  to the card object — this applies a 4px blur + scale to hide them gracefully

---

## 2 — Experience page projects (`src/components/Experience/index.js`)

The Experience page has three separate data arrays:

| Array | Purpose |
|-------|---------|
| `roles` | Employment history (company, period, bullets, stack tags) |
| `projects` | Personal / production projects with descriptions |
| `services` | AI workflow services offered to clients |

### `projects` array — adding a project

Each project object looks like this:

```js
{
  title: 'AI-Powered Contract Analysis Platform',
  level: 'Production — Advanced',   // Badge text shown above the title
  description: 'One or two sentences describing what it does and the impact.',
  stack: ['Python', 'FastAPI', 'React', 'NLP', 'Transformers'],
},
```

**Valid `level` values (use exactly one):**
- `'Production — Advanced'`
- `'Internal — Production'`
- `'Personal — Advanced'`
- `'Personal — Intermediate'`
- `'Prototype — Experimental'`

Append new objects to the `projects` array. They render in order, top to bottom.

### `roles` array — updating employment history

Each role object:

```js
{
  title: 'Legal Software Engineer',    // Job title
  company: 'Kreisson Legal',           // Company name
  period: 'Aug 2025 — Mar 2026',       // Date range (em dash —)
  status: 'COMPLETED',                 // 'ACTIVE' | 'COMPLETED'
  bullets: [
    'Bullet point one.',
    'Bullet point two.',
  ],
  stack: ['React', 'Python', 'FastAPI'],
},
```

---

## 3 — Chatbot responses (`src/components/About/content.js`)

The chatbot on the About page is driven entirely by this file. No backend needed.

### `suggestedPrompts` — clickable quick questions

```js
export const suggestedPrompts = [
  'What projects are you working on?',
  'How do you use AI + law?',
  'What tech do you specialize in?',
];
```

Add new strings to show more clickable prompts. Each prompt must have a
matching key in `contentGuides` or the chatbot will return nothing.

### `contentGuides` — pre-written answers

```js
export const contentGuides = {
  'What projects are you working on?': `...answer text...`,
  'How do you use AI + law?':          `...answer text...`,
  'What tech do you specialize in?':   `...answer text...`,
};
```

The key must **exactly match** the prompt string (case-sensitive).
Answers support plain text only — no JSX or markdown.

### Adding a new prompt + answer

```js
// In suggestedPrompts:
'Tell me about Horizon Legal Docs',

// In contentGuides:
'Tell me about Horizon Legal Docs': `Horizon Legal Docs is a document automation
platform built for Kreisson Legal. It generates construction contract drafts,
extracts clauses, performs compliance review against GDPR/SOX, and auto-cites
case law under AGLC4 standards. Built with React, FastAPI, and a custom NLP
pipeline — deployed in production.`,
```

---

## 4 — Target project details

Use the sections below to populate the three projects the owner wants added.

---

### Project A — Horizon Legal Docs (HorizonLegal.png)

**What it is:** An AI-powered legal document automation platform built and
deployed in production at Kreisson Legal. Automates clause extraction, risk
identification, compliance review, and AGLC4 citation for complex construction
contracts. Reduces lawyer review time by 40%+.

**Homepage card (already exists — update the title/category to match):**

```js
{
  title: 'Horizon Legal Docs',
  category: 'Legal AI · Document Automation',
  image: '/HorizonLegal.png',
},
```

**Experience page project entry (add to `projects` array):**

```js
{
  title: 'Horizon Legal Docs',
  level: 'Production — Advanced',
  description:
    'AI-powered legal document automation platform deployed at Kreisson Legal. ' +
    'Multi-phase clause extraction, risk identification, GDPR/SOX compliance review, ' +
    'and AGLC4 auto-citation for complex construction contracts. ' +
    'Reduced lawyer review time by over 40% per engagement.',
  stack: ['React', 'Python', 'FastAPI', 'NLP', 'Transformers', 'PostgreSQL'],
},
```

**Chatbot prompt + answer (add to `content.js`):**

```js
// suggestedPrompts — add:
'Tell me about Horizon Legal Docs',

// contentGuides — add:
'Tell me about Horizon Legal Docs': `Horizon Legal Docs is a production legal document
automation platform I built at Kreisson Legal. It ingests complex construction contracts,
runs multi-phase clause extraction, flags risk clauses, checks compliance against GDPR
and SOX, and auto-generates AGLC4 citations. The platform reduced lawyer review time
by over 40% per engagement and is live in production. Stack: React, FastAPI, Python,
custom NLP pipelines, PostgreSQL.`,
```

---

### Project B — Arbiter Legal AI (arbiter.png)

**What it is:** A multi-model legal AI research assistant. Uses RAG (Retrieval-
Augmented Generation) with hybrid vector + keyword search to deliver near-instant
answers across large legal document sets. Supports simultaneous queries to multiple
LLMs for comparative reasoning.

**Homepage card (already exists — update the title/category to match):**

```js
{
  title: 'Arbiter Legal AI',
  category: 'Legal AI · RAG · Multi-LLM',
  image: '/arbiter.png',
},
```

**Experience page project entry (add to `projects` array):**

```js
{
  title: 'Arbiter Legal AI',
  level: 'Production — Advanced',
  description:
    'Multi-model legal AI research assistant powered by RAG and hybrid vector search. ' +
    'Delivers near-instant answers across large legal document sets. ' +
    'Supports simultaneous queries to multiple LLMs for comparative legal reasoning. ' +
    'Query response time reduced from several minutes to sub-second.',
  stack: ['Python', 'FastAPI', 'RAG', 'Vector DB', 'Hugging Face', 'React', 'LLM Orchestration'],
},
```

**Chatbot prompt + answer (add to `content.js`):**

```js
// suggestedPrompts — add:
'What is Arbiter Legal AI?',

// contentGuides — add:
'What is Arbiter Legal AI?': `Arbiter is a multi-model legal AI research assistant I built
using RAG and hybrid retrieval. It sits on top of large document sets and returns
near-instant answers by combining vector search with keyword retrieval, then feeding
results into multiple LLMs simultaneously so you can compare their reasoning. Response
times went from several minutes (manual search) to sub-second. Stack: FastAPI, Python,
Hugging Face, vector databases, React frontend, custom LLM orchestration layer.`,
```

---

### Project C — Flask Blockchain (blockchain.png)

**What it is:** A Python/Flask implementation of a blockchain from scratch —
proof-of-work consensus, distributed nodes, transaction validation, and a
REST API for mining and chain inspection. Built as a deep-dive into how
distributed ledger technology actually works under the hood.

**Homepage card (already exists — update the title/category if needed):**

```js
{
  title: 'Flask Blockchain',
  category: 'Python · Web3 · Distributed Systems',
  image: '/blockchain.png',
},
```

**Experience page project entry (add to `projects` array):**

```js
{
  title: 'Flask Blockchain',
  level: 'Personal — Advanced',
  description:
    'Full blockchain implementation from scratch in Python and Flask. ' +
    'Proof-of-work consensus, distributed nodes, transaction validation, ' +
    'and a REST API for mining, inspecting the chain, and registering nodes. ' +
    'Built to deeply understand how distributed ledger systems operate at the protocol level.',
  stack: ['Python', 'Flask', 'REST API', 'Cryptography', 'Distributed Systems', 'Solidity'],
},
```

**Chatbot prompt + answer (add to `content.js`):**

```js
// suggestedPrompts — add:
'Tell me about the blockchain project',

// contentGuides — add:
'Tell me about the blockchain project': `The Flask Blockchain is a full distributed
ledger built from scratch in Python. It implements proof-of-work consensus, peer-to-peer
node registration, transaction validation, and exposes a REST API for mining blocks and
inspecting the chain state. I built it to understand exactly how the Bitcoin protocol
works at the implementation level — not just conceptually. I also have experience with
Solidity for smart contract development.`,
```

---

## 5 — Deploy after every change

After editing any file, run these commands from the project root
(`C:\portfolio\react-portfolio`):

```powershell
# 1. Commit all changes
git add -A
git commit -m "Update projects: <describe what you changed>"
git push origin master

# 2. SSH into Hetzner and rebuild
ssh root@204.168.177.22 "cd /opt/portfolio && git pull origin master && docker compose up -d --build"
```

The Docker build takes ~40 seconds. After it completes the changes are live
at https://aaronk.tech immediately — no DNS or Caddy changes needed.

---

## 6 — Quick reference: what to change per task

| Task | File(s) to edit |
|------|----------------|
| Update a card title / category / image | `Home/Portfolio/index.js` → `featuredProjects` array |
| Add a new card | `Home/Portfolio/index.js` → append to `featuredProjects` |
| Add project to Experience page | `Experience/index.js` → `projects` array |
| Update job history | `Experience/index.js` → `roles` array |
| Add chatbot Q&A | `About/content.js` → `suggestedPrompts` + `contentGuides` |
| Add a new image | Copy file to `public/`, reference as `/filename.png` in code |
| Change resume file | Replace `public/Aaron_Kreidieh_Resume_2026.docx`, update href in `About/index.js` and `Experience/index.js` |
