export const tribeSimulationMeta = {
  title: 'Neural Network Tribe Simulation',
  category: 'Rust · Agent Sim · Economics',
  heroImage: '/dvg_tribe_sim.png',
  overview:
    'The Dynamic Value Gradient (DVG) simulation is a ground-up Rust rebuild where thousands of autonomous agents explore a 2D world with evolving neural networks. They discover chemistry, trade, lend, fight, and invent language — with no central planner. Macro patterns like credit cycles, inequality, and tech eras emerge from millions of local bilateral decisions.',
  researchLens:
    'Markets as distributed search over an expandable possibility space — the compound system decides whether the economy stays open-ended or crystallises.',
};

export const tribeSimulationStack = [
  'Rust',
  'Python',
  'Agent Simulation',
  'Hebbian Learning',
  'Computational Economics',
  'Event Analysis',
];

export const tribeSimulationHighlights = [
  '1.77M bilateral trades across 255 goods — food barter, coin, and emergent compounds',
  '670+ compounds discovered via graded chemistry (steel, wine, armor) — no hand-written recipes',
  '12,914 reputation-indexed loans with boom–bust population cycles (~4,400-tick trough)',
  '2.1M utterances and evolving brain topologies — language, culture, and cognition co-evolve',
];

export const tribeSimulationFindings = [
  {
    title: 'Trade & allocation',
    caption: 'Bilateral trade volume — subsistence barter, coin, and compound goods',
    image: '/dvg/findings/trade_volume_over_time.png',
  },
  {
    title: 'Emergent chemistry',
    caption: 'Compound catalog growth across the reference run',
    image: '/dvg/findings/compound_count.png',
  },
  {
    title: 'Population cycles',
    caption: 'Boom–bust dynamics over ~30k simulation ticks',
    image: '/dvg/findings/population_over_time.png',
  },
];
