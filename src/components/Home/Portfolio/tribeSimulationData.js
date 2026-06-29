export const tribeSimulationMeta = {
  title: 'Neural Network Tribe Simulation',
  category: 'Rust · Agent Sim · Economics',
  heroImage: '/dvg_tribe_sim.png',
  overview:
    'The Dynamic Value Gradient (DVG) simulation is a ground-up Rust rebuild where thousands of autonomous agents explore a 2D world with evolving neural networks. They discover chemistry, trade, lend, fight, and invent language — with no central planner. Macro patterns like credit cycles, inequality, and tech eras emerge from millions of local bilateral decisions.',
  runLabel: 'Reference run golden_10k_1 · ~30k ticks · 10,000 starting agents · Mechanical era',
};

export const tribeSimulationTechStack = {
  intro:
    'Built as a research instrument: a high-performance Rust simulation engine paired with a Python forensic analysis pipeline over 199M+ logged events. Neural networks modulate agent decisions — they do not replace them.',
  rust: {
    title: 'Rust simulation engine',
    items: [
      'dvgt_core — config, RNG, drives, staged bilateral effects, typed event records',
      'dvgt_world — tile grid, seasons, spatial hashing',
      'dvgt_agent — value-gradient action scoring from local perception',
      'dvgt_brain — evolving graph topology, Hebbian learning, crossover & mutation',
      'dvgt_econ — bilateral trade, graded compounds, credit, services, ledger',
      'dvgt_sim — tick loop, zstd-compressed event shards, periodic snapshots',
      'CLI + egui menu — reproducible runs with configurable seeds and presets',
    ],
  },
  neural: {
    title: 'Evolving neural networks',
    items: [
      'Brains bias the value-gradient scorer — they do not directly pick actions.',
      'Reward prediction error (realized satisfaction) drives plasticity alongside Hebbian updates.',
      'Topology grows over time: nodes and edges mutate, cross over, and are inherited.',
      '2,433 brain topology samples logged — networks visibly complexify across generations.',
      'Neurochemistry (dopamine, cortisol, oxytocin, hunger) feeds into action bias and language grounding.',
    ],
    image: '/dvg/findings/brain_topology.png',
    imageCaption: 'Mean brain nodes and connections over time',
  },
  python: {
    title: 'Python analysis pipeline',
    items: [
      'dvg_analysis — streaming collectors for trade, credit, language, demography, hierarchy',
      '61 world snapshots · 47 metrics per snapshot · topic-specific CSV exports',
      'Full run analysis: unpack events.jsonl → plots, findings, agent biographies',
      'matplotlib / numpy / pandas — reproducible forensic reports per golden run',
    ],
  },
};

export const tribeSimulationWorldMaps = [
  { src: '/dvg/map_seed_42.png', caption: 'Seed 42 — agents, resources, and structures across the arena' },
  { src: '/dvg/map_seed_777.png', caption: 'Seed 777 — alternate world layout' },
  { src: '/dvg/map_seed_1.png', caption: 'Seed 1 — alternate world layout' },
];

export const tribeSimulationAnthropology = {
  title: 'Crafting parallel: Neolithic → Metal Age',
  body:
    'The compound system is not a fixed tech tree — it is graded material chemistry. 28 continuous attributes transformed by processes (knapping, smelting, forging, fermenting, weaving) produce emergent artifacts that mirror real human technological progression without hand-written recipes.',
  stages: [
    {
      era: 'Neolithic',
      parallel: 'Knapped edges, hafted points, woven textiles, sealed vessels, fermented stores',
      sim: 'knap-compound, knapped-edge, hafted-point, woven-textile, sealed-vessel, fermented-wine, cured-ration',
    },
    {
      era: 'Copper / Bronze transition',
      parallel: 'First workable metals, alloy experimentation, conductive properties',
      sim: 'copper-metal (18 variants), bronze-alloy (31 variants), 59 conductive compounds',
    },
    {
      era: 'Iron / Steel',
      parallel: 'Higher-depth metallurgy, fitted armor, tools with production depth',
      sim: 'steel (23 variants), fitted-armor (depth 2–8), cutting-tool and piercing-weapon classes',
    },
    {
      era: 'Proto-culture',
      parallel: 'Spoken signs, clay tablets, recipe transmission between agents',
      sim: '2.1M utterances, 56 word tokens, clay tablet inscriptions, 23M discovery/transmission events',
    },
  ],
};

export const tribeSimulationCompounds = [
  { name: 'fermented-wine', type: 'Container / storage', note: '1,483+ trade events — fermented stores' },
  { name: 'knapped-edge', type: 'Cutting tool', note: 'Neolithic knapping — armor depth 3' },
  { name: 'hafted-point', type: 'Piercing weapon', note: 'Hafted stone tool class' },
  { name: 'knap-compound', type: 'Blunt tool', note: 'Invented by agent #182' },
  { name: 'fitted-armor', type: 'Armor', note: 'Depth 2–8 — metallurgical progression' },
  { name: 'woven-textile', type: 'Textile', note: 'Multiple depth variants' },
  { name: 'sealed-vessel', type: 'Container', note: 'Storage and preservation' },
  { name: 'cured-ration', type: 'Preserved food', note: 'High-depth preservation craft' },
  { name: 'copper-metal', type: 'Metal', note: '18 metallic variants' },
  { name: 'bronze-alloy', type: 'Alloy', note: '31 bronze variants' },
  { name: 'steel', type: 'Metal', note: '23 steel variants — Mechanical era' },
  { name: 'combine-compound', type: 'Composite', note: 'Multi-process synthesis' },
];

export const tribeSimulationWeapons = [
  'knapped-edge — cutting tool / edged weapon (Neolithic parallel)',
  'hafted-point — piercing weapon',
  'fitted-armor — body armor (depth 2–8, metal-age parallel)',
  'AttackFor / Protect services — organised violence and defence',
  '185 attack orders (agent #2014) · 257 attack orders (agent #182)',
];

export const tribeSimulationLanguage = {
  stats: [
    '2,102,874 utterances across the run',
    '56 distinct word tokens (bigram phoneme pairs)',
    'Grounded to speaker state: hunger, dopamine, cortisol, oxytocin',
    'Clay tablets preserve craft knowledge and spoken signs asynchronously',
  ],
  signs: [
    { sign: 'ka-lo', meaning: 'water / need + work / reward' },
    { sign: 'lo-ka', meaning: 'work / reward + water / need (order divergence → emergent syntax)' },
    { sign: 'ka-tu', meaning: 'water / need + alarm / stress' },
  ],
  image: '/dvg/findings/token_entropy.png',
  imageCaption: 'Token entropy — conventionalisation over time',
};

export const tribeSimulationAgents = [
  {
    id: '#2014',
    role: 'Warrior / chief',
    detail: '12 kills · 185 attack orders · 92 trades · coined 3 words · dominance 1.00',
    image: '/dvg/biographies/radar_2014_0.png',
  },
  {
    id: '#1195',
    role: 'Scribe / magnate',
    detail: 'Wealth 112.6 · clay tablet inscriptions · 41 trades · low dominance — knowledge over combat',
    image: '/dvg/biographies/radar_1195_2.png',
  },
  {
    id: '#182',
    role: 'Inventor / thief',
    detail: 'Invented knap-compound · 307 trades · 257 attack orders · 23 children',
    image: '/dvg/biographies/radar_182_0.png',
  },
  {
    id: '#2308',
    role: 'War-commander',
    detail: '9 kills · 166 attack orders · coined 6 words · GatherFor & AttackFor services',
    image: null,
  },
];

export const tribeSimulationFindingsGrid = [
  {
    category: 'Trade & markets',
    stats: ['1.77M trades · 255 goods', 'Food barter ~82% · coin conservation verified', '4,232 compound trade events'],
    image: '/dvg/findings/trade_volume_over_time.png',
  },
  {
    category: 'Credit & finance',
    stats: ['12,914 loans · ~2.84% mean rate', '20.8% default rate', '1,957 investments settled'],
    image: '/dvg/findings/credit_over_time.png',
  },
  {
    category: 'Innovation',
    stats: ['670+ compounds discovered', '78 metallic · 59 conductive', 'Innovation frontier still expanding at stop'],
    image: '/dvg/findings/compound_count.png',
  },
  {
    category: 'Demography',
    stats: ['75,480 births · 70,439 deaths', '~4,400-tick population cycle', 'Mean age at death ~922 ticks'],
    image: '/dvg/findings/population_over_time.png',
  },
  {
    category: 'Hierarchy',
    stats: ['60 hierarchy transitions analysed', 'Elite composition churns while Gini stays stable', 'Warrior & scribe archetypes co-exist'],
    image: '/dvg/findings/hierarchy_turnover.png',
  },
  {
    category: 'Knowledge transmission',
    stats: ['22,972,988 discovery events', 'Recipe teaching as paid service', 'Tablets + utterances spread craft knowledge'],
    image: '/dvg/findings/knowledge_transmission.png',
  },
  {
    category: 'Language',
    stats: ['56 word tokens', 'Grounded phoneme states per utterance', 'Word-order divergence signals emergent syntax'],
    image: '/dvg/findings/token_entropy.png',
  },
  {
    category: 'Credit dynamics',
    stats: ['Rates indexed to reputation', 'Population & credit move synchronously', 'Malthusian-first cycle read'],
    image: '/dvg/findings/loan_interest_rates.png',
  },
];
