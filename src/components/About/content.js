export const skillTags = [
  { label: 'HTML', color: '#F06529' },
  { label: 'CSS', color: '#28A4D9' },
  { label: 'JavaScript', color: '#EFD81D' },
  { label: 'TypeScript', color: '#3178C6' },
  { label: 'Python', color: '#306998' },
  { label: 'PowerShell', color: '#5391FE' },
  { label: 'Django', color: '#44B78B' },
  { label: 'Flask', color: '#ffffff' },
  { label: 'React', color: '#5ED4F5' },
  { label: 'Next.js', color: '#ffffff' },
  { label: 'TensorFlow', color: '#FF6F00' },
  { label: 'FastAPI', color: '#009688' },
  { label: 'Solidity', color: '#636890' },
];

export const focusAreas = [
  { label: 'Legal AI', icon: null },
  { label: 'Simulations', icon: null },
  { label: 'Blockchain', icon: null },
  { label: 'Robotics', icon: null },
];

export const suggestedPrompts = [
  'What projects are you working on?',
  'How do you use AI + law?',
  'What tech do you specialize in?',
  'Tell me about Horizon Legal Docs',
  'What is Arbiter Legal AI?',
  'Tell me about the blockchain project',
];

export const contentGuides = {
  'What projects are you working on?': `Right now I'm focused on two main things. First, Horizon Legal Docs — a legal document automation platform I built from the ground up. It uses NLP and transformer models to ingest documents, extract clauses, run compliance checks, and auto-generate citations. Second, I'm building simulation environments for agent-based modelling and reinforcement learning — multi-agent systems with emergent behaviour. This portfolio itself is also a live project: the pixel world, terminal panels, and interactive avatar are all custom-built.`,

  'How do you use AI + law?': `I build tools that sit between legal reasoning and machine learning pipelines. I've designed AI-assisted workflows for contract review — clause extraction, compliance checking, and automated document generation. The core idea is taking tasks that legal professionals spend hours on and building software that handles the mechanical parts so they can focus on judgment. I work with NLP, transformers, RAG systems, and custom legal citation engines.`,

  'What tech do you specialize in?': `My core stack is React + Python. Frontend: React, TypeScript, SCSS, animation systems. Backend: FastAPI, Django, Flask. AI/ML: TensorFlow, Hugging Face, custom NLP pipelines. I've also shipped smart contracts in Solidity and built hardware interfaces with ROS2. But my strongest combination is full-stack web + AI — building tools where a React frontend talks to a Python ML backend, especially in legal tech.`,

  'Tell me about Horizon Legal Docs': `Horizon Legal Docs is a production legal document automation platform I designed and built from scratch. It ingests legal documents, runs multi-phase clause extraction, flags risk areas, checks compliance, and auto-generates citations. The full stack — React frontend, FastAPI backend, custom NLP pipelines, and PostgreSQL — was built independently end to end. It's live in production at docs.aaronk.tech.`,

  'What is Arbiter Legal AI?': `Arbiter is a multi-model legal AI research assistant I built using RAG and hybrid retrieval. It sits on top of large document sets and returns near-instant answers by combining vector search with keyword retrieval, then feeding results into multiple LLMs simultaneously so you can compare their reasoning. Response times went from several minutes (manual search) to sub-second. Stack: FastAPI, Python, Hugging Face, vector databases, React frontend, custom LLM orchestration layer.`,

  'Tell me about the blockchain project': `The Flask Blockchain is a full distributed ledger built from scratch in Python. It implements proof-of-work consensus, peer-to-peer node registration, transaction validation, and exposes a REST API for mining blocks and inspecting the chain state. I built it to understand exactly how the Bitcoin protocol works at the implementation level — not just conceptually. I also have experience with Solidity for smart contract development.`,
};

export const defaultGreeting =
  "Hey — I'm Aaron. Ask me about legal AI, my projects, or the tech I work with.";
