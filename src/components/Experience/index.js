import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedLetters from '../AnimatedLetters';
import './index.scss';

const roles = [
  {
    title: 'Legal Software Engineer',
    company: 'Kreisson Legal',
    period: 'Aug 2025 — Mar 2026',
    status: 'COMPLETED',
    bullets: [
      'Built an intelligent contract analysis platform for construction contracts — automated clause extraction, risk identification, and compliance review, reducing lawyer review time by over 40% per engagement.',
      'Architected a document retrieval system using vector search and hybrid retrieval, reducing query response time from minutes to near-instant.',
      'Designed an AI-powered legal research and publication platform, achieving 95% reduction in content production time.',
      'Operated across the full stack — backend API design, database architecture, React frontend interfaces — delivering production systems within a resource-constrained environment.',
      'Built distributed compute clusters for internal infrastructure, eliminating unnecessary cloud spend and enabling scale-on-demand at critical market points.',
    ],
    stack: ['React', 'Python', 'FastAPI', 'RAG', 'Vector DB', 'Hugging Face', 'Ubuntu Server'],
  },
  {
    title: 'Helpdesk / Document Automation',
    company: 'LEAP Legal Software',
    period: 'May 2023 — Dec 2023',
    status: 'COMPLETED',
    bullets: [
      'Automated legal documents using Word and Adobe PDF tools, streamlining document production workflows for law firm clients.',
      'Maintained JavaScript code for e-signature integrations ensuring reliable client-facing functionality.',
      'Interpreted XML and JSON data files to support accurate data management and software configuration.',
      'Managed trust accounting compliance and invoice creation workflows for law firm billing processes.',
    ],
    stack: ['JavaScript', 'XML/JSON', 'Legal Tech', 'Document Automation'],
  },
  {
    title: 'Intern',
    company: 'Lawpath',
    period: 'Nov 2022 — Feb 2023',
    status: 'COMPLETED',
    bullets: [
      'Built a search engine prototype for internal testing purposes.',
      'Reviewed legal documents and contracts to develop understanding of legal tech product requirements.',
      'Presented a portfolio of product ideas directly to the CEO — proposals were subsequently adopted for integration into Lawpath\'s platform.',
    ],
    stack: ['Frontend', 'Backend', 'Legal Tech', 'Product'],
  },
];

const projects = [
  {
    title: 'AI-Powered Contract Analysis Platform',
    level: 'Production — Advanced',
    description:
      'Production system for automated analysis of complex construction contracts. Multi-phase document extraction, risk identification, and compliance review. Reduced lawyer engagement time by over 40% with measurable monthly cost savings.',
    stack: ['Python', 'FastAPI', 'React', 'NLP', 'Transformers'],
  },
  {
    title: 'Legal Research & RAG Platform',
    level: 'Production — Advanced',
    description:
      'Sophisticated document retrieval system using hybrid retrieval techniques and vector search. Query response time reduced from minutes to near-instant. Supports multi-model LLM integration for intelligent legal research across large document sets.',
    stack: ['RAG', 'Vector Search', 'LLM', 'Python', 'FastAPI'],
  },
  {
    title: 'Legal Publication Automation Platform',
    level: 'Production — Advanced',
    description:
      'Automated pipeline for legal content research and publication. 95% reduction in content production time through workflow orchestration and LLM integration.',
    stack: ['Python', 'LLM', 'Automation', 'NLP'],
  },
  {
    title: 'Distributed Infrastructure Clusters',
    level: 'Internal — Production',
    description:
      'Self-hosted compute clusters for internal application deployment. Eliminated unnecessary cloud costs by building on-premise infrastructure that scales only at critical market points — delivering significant cost savings.',
    stack: ['Ubuntu Linux', 'GPU Infra', 'Distributed Computing', 'DevOps'],
  },
];

const services = [
  {
    title: 'Contract Intelligence',
    icon: '§',
    description:
      'Automated clause extraction, risk identification, and compliance review for complex contracts. Custom-built NLP pipelines that reduce review time by 40%+.',
  },
  {
    title: 'Document Automation',
    icon: '⚙',
    description:
      'End-to-end document generation and processing pipelines. From intake to output — drafting, citation, and formatting handled by AI with human oversight.',
  },
  {
    title: 'RAG & Legal Research',
    icon: '⟐',
    description:
      'Retrieval-augmented generation systems for instant legal research across large document sets. Hybrid vector + keyword search with multi-model orchestration.',
  },
  {
    title: 'Agentic Workflows',
    icon: '◈',
    description:
      'Multi-agent AI systems for complex business and legal processes. Task decomposition, autonomous execution, and evaluation loops that handle end-to-end workflows.',
  },
  {
    title: 'Custom AI Integration',
    icon: '△',
    description:
      'Full-stack integration of LLMs, embeddings, and ML models into existing business systems. API design, frontend interfaces, and deployment infrastructure.',
  },
  {
    title: 'Infrastructure & Deployment',
    icon: '▣',
    description:
      'Self-hosted server environments, distributed compute clusters, and GPU infrastructure. Scale when needed, save when idle — no unnecessary cloud spend.',
  },
];

const skills = {
  'Languages': ['Python', 'TypeScript', 'JavaScript', 'SQL', 'Rust', 'Solidity', 'PowerShell', 'ARM Assembly'],
  'Frameworks': ['FastAPI', 'Next.js', 'React', 'Node.js', 'Django', 'Flask'],
  'AI / ML': ['LLM Integration', 'RAG', 'Vector Search', 'Hybrid Retrieval', 'Embedding Models', 'Hugging Face', 'TensorFlow', 'Multi-model Orchestration'],
  'Infrastructure': ['Ubuntu Server Admin', 'Self-hosted Deployment', 'Distributed Computing', 'GPU Infra', 'REST APIs', 'WebSockets'],
  'Databases': ['MongoDB', 'SQL', 'Vector DBs', 'Supabase'],
  'Legal Tech': ['Contract Analysis', 'Document Automation', 'Trust Accounting', 'AGLC4 Citations', 'E-signature'],
};

const impactMetrics = [
  { value: '40%+', label: 'review time reduced' },
  { value: '95%', label: 'content automation gain' },
  { value: 'Instant', label: 'retrieval response time' },
  { value: 'Law + AI', label: 'domain advantage' },
];

const Experience = () => {
  const [letterClass, setLetterClass] = useState('text-animate');
  const [scrollState, setScrollState] = useState({ progress: 0, scrollY: 0 });

  useEffect(() => {
    const timer = setTimeout(
      () => setLetterClass('text-animate-hover'),
      4000
    );
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const page = document.querySelector('.page');

    if (!page) {
      return undefined;
    }

    const handleScroll = () => {
      const maxScroll = Math.max(page.scrollHeight - page.clientHeight, 1);
      const scrollY = page.scrollTop;
      const progress = Math.min(scrollY / maxScroll, 1);

      setScrollState({ progress, scrollY });
    };

    handleScroll();
    page.addEventListener('scroll', handleScroll, { passive: true });

    return () => page.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="experience-page"
      style={{
        '--scroll-progress': `${scrollState.progress}`,
        '--parallax-soft': `${scrollState.scrollY * 0.08}px`,
        '--parallax-mid': `${scrollState.scrollY * 0.14}px`,
        '--parallax-strong': `${scrollState.scrollY * 0.2}px`,
      }}
    >
      <span className="tags exp-top-tag">&lt;body&gt;</span>

      <div className="exp-ambient exp-ambient--one" />
      <div className="exp-ambient exp-ambient--two" />
      <div className="exp-scroll-rail" aria-hidden="true">
        <span className="exp-scroll-rail__line" />
        <span className="exp-scroll-rail__glow" />
      </div>

      {/* Hero */}
      <section className="exp-hero">
        <h1>
          <AnimatedLetters
            letterClass={letterClass}
            strArray={'Experience'.split('')}
            idx={15}
          />
        </h1>
        <p className="exp-hero__summary">
          Legal Software Engineer combining Law and Commerce degrees with
          self-taught full-stack and AI engineering expertise. Specialising in
          production AI systems for legal workflows &mdash; contract analysis,
          retrieval-augmented generation, and legal research automation that
          deliver measurable business impact.
        </p>
        <div className="exp-hero__meta">
          <span>Sydney, Australia</span>
          <span>Macquarie University &mdash; Law &amp; Accounting</span>
          <span>
            <a href="https://github.com/Aaron-system" target="_blank" rel="noreferrer">GitHub</a>
            {' · '}
            <a href="https://www.linkedin.com/in/aaron-kreidieh-1383391ab/" target="_blank" rel="noreferrer">LinkedIn</a>
          </span>
        </div>
        <div className="exp-metrics">
          {impactMetrics.map((metric) => (
            <div key={metric.label} className="exp-metric-card">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Career Timeline */}
      <section className="exp-section">
        <h2 className="exp-section__heading">
          <span className="exp-section__tag">&lt;career&gt;</span>
          Career Timeline
        </h2>
        <div className="timeline">
          {roles.map((role, i) => (
            <div key={role.company} className="timeline__item" style={{ animationDelay: `${0.3 + i * 0.2}s` }}>
              <div className="timeline__marker">
                <span className={`timeline__dot timeline__dot--${role.status === 'ACTIVE' ? 'active' : 'done'}`} />
                {i < roles.length - 1 && <span className="timeline__line" />}
              </div>
              <div className="timeline__card">
                <div className="timeline__card-header">
                  <div>
                    <h3>{role.title}</h3>
                    <p className="timeline__company">{role.company}</p>
                  </div>
                  <div className="timeline__right">
                    <span className={`timeline__status timeline__status--${role.status === 'ACTIVE' ? 'active' : 'done'}`}>
                      {role.status}
                    </span>
                    <span className="timeline__period">{role.period}</span>
                  </div>
                </div>
                <ul className="timeline__bullets">
                  {role.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
                <div className="timeline__stack">
                  {role.stack.map((s) => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Production Projects */}
      <section className="exp-section">
        <h2 className="exp-section__heading">
          <span className="exp-section__tag">&lt;production&gt;</span>
          Production Projects
        </h2>
        <div className="project-grid">
          {projects.map((p, i) => (
            <div key={p.title} className="project-card" style={{ animationDelay: `${0.2 + i * 0.15}s` }}>
              <div className="project-card__level">{p.level}</div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="project-card__stack">
                {p.stack.map((s) => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Workflow Services */}
      <section className="exp-section">
        <h2 className="exp-section__heading">
          <span className="exp-section__tag">&lt;services&gt;</span>
          AI Workflow Services
        </h2>
        <p className="services-intro">
          I build AI-powered workflow systems for law firms, legal teams, and
          businesses that need intelligent automation without the enterprise
          price tag. Every system is custom-built to your domain.
        </p>
        <div className="services-grid">
          {services.map((s, i) => (
            <div key={s.title} className="service-card" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
              <span className="service-card__icon">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Skills */}
      <section className="exp-section">
        <h2 className="exp-section__heading">
          <span className="exp-section__tag">&lt;stack&gt;</span>
          Technical Skills
        </h2>
        <div className="skills-table">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="skills-row">
              <span className="skills-row__label">{category}</span>
              <div className="skills-row__items">
                {items.map((item) => (
                  <span key={item} className="tag">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="exp-section">
        <h2 className="exp-section__heading">
          <span className="exp-section__tag">&lt;education&gt;</span>
          Education
        </h2>
        <div className="education-block">
          <h3>Bachelor of Law and Accounting</h3>
          <p className="education-block__school">Macquarie University &mdash; Completed 2025</p>
          <p className="education-block__note">
            Self-taught full-stack developer since 2020. Built projects across
            web, AI, blockchain, and systems programming while completing
            dual degrees in law and commerce.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="exp-cta">
        <a
          href="/Aaron_Kreidieh_Resume_2026.docx"
          download="Aaron_Kreidieh_Resume_2026.docx"
          target="_blank"
          rel="noopener noreferrer"
          className="exp-cta__btn"
        >
          Download Resume
        </a>
        <Link to="/contact" className="exp-cta__btn exp-cta__btn--outline">
          Get in Touch
        </Link>
      </section>

      <div className="exp-footer-tag">
        <span>&lt;body&gt;</span>
        <br />
        <span>&lt;/body&gt;</span>
        <br />
        <span className="bottom-tag-html">&lt;/html&gt;</span>
      </div>
    </div>
  );
};

export default Experience;
