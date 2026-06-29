import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  tribeSimulationAgents,
  tribeSimulationAnthropology,
  tribeSimulationCompounds,
  tribeSimulationFindingsGrid,
  tribeSimulationLanguage,
  tribeSimulationMeta,
  tribeSimulationTechStack,
  tribeSimulationWeapons,
  tribeSimulationWorldMaps,
} from './tribeSimulationData';
import './TribeSimulationModal.scss';

const TribeSimulationModal = ({ onClose }) => {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    const { body } = document;
    const page = document.querySelector('.page');
    const previousBodyOverflow = body.style.overflow;
    const previousPageOverflow = page ? page.style.overflow : '';

    body.style.overflow = 'hidden';
    if (page) page.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      body.style.overflow = previousBodyOverflow;
      if (page) page.style.overflow = previousPageOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className="tribe-modal" role="dialog" aria-modal="true" aria-labelledby="tribe-modal-title">
      <button type="button" className="tribe-modal__backdrop" aria-label="Close" onClick={onClose} />

      <div className="tribe-modal__panel">
        <header className="tribe-modal__header">
          <div>
            <p className="tribe-modal__eyebrow">{tribeSimulationMeta.category}</p>
            <h2 id="tribe-modal-title">{tribeSimulationMeta.title}</h2>
            <p className="tribe-modal__run">{tribeSimulationMeta.runLabel}</p>
          </div>
          <button type="button" className="tribe-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="tribe-modal__scroll">
          <figure className="tribe-modal__hero">
            <img src={tribeSimulationMeta.heroImage} alt="DVG simulation overview" />
          </figure>

          <section className="tribe-modal__block">
            <h3>Overview</h3>
            <p>{tribeSimulationMeta.overview}</p>
          </section>

          {/* Tech stack — expanded */}
          <section className="tribe-modal__block tribe-modal__block--tech">
            <h3>Tech stack</h3>
            <p className="tribe-modal__lead">{tribeSimulationTechStack.intro}</p>

            <div className="tribe-modal__tech-group">
              <h4>{tribeSimulationTechStack.rust.title}</h4>
              <ul>
                {tribeSimulationTechStack.rust.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="tribe-modal__tech-group">
              <h4>{tribeSimulationTechStack.neural.title}</h4>
              <ul>
                {tribeSimulationTechStack.neural.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <figure className="tribe-modal__inline-figure">
                <img
                  src={tribeSimulationTechStack.neural.image}
                  alt={tribeSimulationTechStack.neural.imageCaption}
                  loading="lazy"
                />
                <figcaption>{tribeSimulationTechStack.neural.imageCaption}</figcaption>
              </figure>
            </div>

            <div className="tribe-modal__tech-group">
              <h4>{tribeSimulationTechStack.python.title}</h4>
              <ul>
                {tribeSimulationTechStack.python.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* World maps */}
          <section className="tribe-modal__block">
            <h3>The world</h3>
            <p className="tribe-modal__lead">
              Top-down simulation arenas — agents, seasonal resources, structures, and tribal territories across different seeds.
            </p>
            <div className="tribe-modal__map-grid">
              {tribeSimulationWorldMaps.map((map) => (
                <figure key={map.src} className="tribe-modal__map">
                  <img src={map.src} alt={map.caption} loading="lazy" />
                  <figcaption>{map.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* Anthropology parallel */}
          <section className="tribe-modal__block tribe-modal__block--anthro">
            <h3>{tribeSimulationAnthropology.title}</h3>
            <p>{tribeSimulationAnthropology.body}</p>
            <div className="tribe-modal__era-grid">
              {tribeSimulationAnthropology.stages.map((stage) => (
                <article key={stage.era} className="tribe-modal__era">
                  <h4>{stage.era}</h4>
                  <p className="tribe-modal__era-real">{stage.parallel}</p>
                  <p className="tribe-modal__era-sim">
                    <span>In simulation:</span> {stage.sim}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Compounds */}
          <section className="tribe-modal__block">
            <h3>Compounds discovered</h3>
            <p className="tribe-modal__lead">670+ emergent compounds from graded chemistry — selected traded & inscribed examples:</p>
            <div className="tribe-modal__data-table">
              {tribeSimulationCompounds.map((compound) => (
                <div key={compound.name} className="tribe-modal__data-row">
                  <span className="tribe-modal__data-name">{compound.name}</span>
                  <span className="tribe-modal__data-type">{compound.type}</span>
                  <span className="tribe-modal__data-note">{compound.note}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Weapons */}
          <section className="tribe-modal__block">
            <h3>Weapons & conflict</h3>
            <ul className="tribe-modal__list">
              {tribeSimulationWeapons.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Language */}
          <section className="tribe-modal__block">
            <h3>Language & signs</h3>
            <ul className="tribe-modal__list">
              {tribeSimulationLanguage.stats.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="tribe-modal__sign-grid">
              {tribeSimulationLanguage.signs.map((sign) => (
                <div key={sign.sign} className="tribe-modal__sign">
                  <code>{sign.sign}</code>
                  <span>{sign.meaning}</span>
                </div>
              ))}
            </div>
            <figure className="tribe-modal__inline-figure">
              <img src={tribeSimulationLanguage.image} alt={tribeSimulationLanguage.imageCaption} loading="lazy" />
              <figcaption>{tribeSimulationLanguage.imageCaption}</figcaption>
            </figure>
          </section>

          {/* Agents */}
          <section className="tribe-modal__block">
            <h3>Notable agents</h3>
            <div className="tribe-modal__agent-grid">
              {tribeSimulationAgents.map((agent) => (
                <article key={agent.id} className="tribe-modal__agent">
                  {agent.image && (
                    <img src={agent.image} alt={`Trait radar for agent ${agent.id}`} loading="lazy" />
                  )}
                  <div>
                    <h4>
                      {agent.id} <span>{agent.role}</span>
                    </h4>
                    <p>{agent.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Findings presentation grid */}
          <section className="tribe-modal__block tribe-modal__block--findings">
            <h3>Research findings</h3>
            <div className="tribe-modal__findings-grid">
              {tribeSimulationFindingsGrid.map((finding) => (
                <article key={finding.category} className="tribe-modal__finding-card">
                  <h4>{finding.category}</h4>
                  <ul>
                    {finding.stats.map((stat) => (
                      <li key={stat}>{stat}</li>
                    ))}
                  </ul>
                  <figure>
                    <img src={finding.image} alt={finding.category} loading="lazy" />
                  </figure>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TribeSimulationModal;
