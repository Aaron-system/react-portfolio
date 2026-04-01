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
];

export const contentGuides = {
  'What projects are you working on?': `Right now I'm focused on two things. First, a legal document automation platform — it uses NLP and transformer models to draft contracts, extract clauses, and auto-cite case law under AGLC4 standards. I built the full stack at Kreisson Legal and I'm continuing to develop it independently. Second, I'm building simulation environments for agent-based modeling and reinforcement learning — multi-agent systems with emergent behaviour. This portfolio is also a live project: the pixel world, terminal panels, and interactive avatar are all custom-built.`,

  'How do you use AI + law?': `I build tools that sit between legal reasoning and machine learning pipelines. At Kreisson Legal, I designed AI-assisted workflows for contract review — clause extraction, compliance checking against frameworks like GDPR and SOX, and automated document generation. The core idea is taking tasks that lawyers spend hours on (reviewing contracts, citing precedent, checking compliance) and building software that handles the mechanical parts so they can focus on judgment. I work with NLP, transformers, and custom legal citation engines.`,

  'What tech do you specialize in?': `My core stack is React + Python. Frontend: React, TypeScript, SCSS, animation systems. Backend: FastAPI, Django, Flask. AI/ML: TensorFlow, Hugging Face, custom NLP pipelines. I've also shipped smart contracts in Solidity and built hardware interfaces with ROS2. But my strongest combination is full-stack web + AI — building tools where a React frontend talks to a Python ML backend, especially in legal tech.`,
};

export const defaultGreeting =
  "Hey — I'm Aaron. Ask me about legal AI, my projects, or the tech I work with.";
