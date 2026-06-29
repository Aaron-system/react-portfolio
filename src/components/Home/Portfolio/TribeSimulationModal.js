import { useEffect, useMemo, useState } from 'react';
import {
  tribeSimulationMeta,
  tribeSimulationSections,
  tribeSimulationStats,
} from './tribeSimulationData';
import './TribeSimulationModal.scss';

const TribeSimulationModal = ({ onClose }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const filteredSections = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return tribeSimulationSections;

    return tribeSimulationSections.filter((section) => {
      const haystack = [
        section.title,
        section.body,
        ...(section.bullets || []),
        ...(section.tags || []),
        section.imageCaption,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [query]);

  return (
    <div className="tribe-modal" role="dialog" aria-modal="true" aria-labelledby="tribe-modal-title">
      <button type="button" className="tribe-modal__backdrop" aria-label="Close" onClick={onClose} />

      <div className="tribe-modal__panel">
        <header className="tribe-modal__header">
          <div className="tribe-modal__header-copy">
            <p className="tribe-modal__eyebrow">{tribeSimulationMeta.category}</p>
            <h2 id="tribe-modal-title">{tribeSimulationMeta.title}</h2>
            <p className="tribe-modal__subtitle">{tribeSimulationMeta.subtitle}</p>
            <p className="tribe-modal__run">{tribeSimulationMeta.runLabel}</p>
          </div>
          <button type="button" className="tribe-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="tribe-modal__hero">
          <img src={tribeSimulationMeta.heroImage} alt="DVG simulation findings composite" />
          <img src={tribeSimulationMeta.mapImage} alt="Simulation world map" />
        </div>

        <div className="tribe-modal__stats">
          {tribeSimulationStats.map((stat) => (
            <div key={stat.label} className="tribe-modal__stat">
              <span className="tribe-modal__stat-value">{stat.value}</span>
              <span className="tribe-modal__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="tribe-modal__search-wrap">
          <label htmlFor="tribe-modal-search" className="tribe-modal__search-label">
            Search findings, systems, stories, and theory
          </label>
          <input
            id="tribe-modal-search"
            type="search"
            className="tribe-modal__search"
            placeholder="Try: credit, chemistry, language, markets as search, agent 1195..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoFocus
          />
          <p className="tribe-modal__search-meta">
            {filteredSections.length} section{filteredSections.length === 1 ? '' : 's'} matched
          </p>
        </div>

        <div className="tribe-modal__body">
          {filteredSections.length === 0 ? (
            <p className="tribe-modal__empty">No sections match that search. Try trade, brains, or theory.</p>
          ) : (
            filteredSections.map((section) => (
              <article key={section.id} className="tribe-modal__section">
                <div className="tribe-modal__section-head">
                  <h3>{section.title}</h3>
                  {section.tags && (
                    <div className="tribe-modal__tags">
                      {section.tags.slice(0, 5).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <p>{section.body}</p>
                {section.bullets && (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
                {section.image && (
                  <figure className="tribe-modal__figure">
                    <img src={section.image} alt={section.imageCaption || section.title} />
                    {section.imageCaption && <figcaption>{section.imageCaption}</figcaption>}
                  </figure>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TribeSimulationModal;
