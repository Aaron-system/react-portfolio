import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  tribeSimulationFindings,
  tribeSimulationHighlights,
  tribeSimulationMeta,
  tribeSimulationStack,
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

          <section className="tribe-modal__block">
            <h3>Tech stack</h3>
            <div className="tribe-modal__stack">
              {tribeSimulationStack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </section>

          <section className="tribe-modal__block">
            <h3>Key findings</h3>
            <ul className="tribe-modal__highlights">
              {tribeSimulationHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="tribe-modal__block tribe-modal__plots">
            <h3>From the reference run</h3>
            <div className="tribe-modal__plot-grid">
              {tribeSimulationFindings.map((finding) => (
                <figure key={finding.title} className="tribe-modal__plot">
                  <img src={finding.image} alt={finding.caption} loading="lazy" />
                  <figcaption>
                    <strong>{finding.title}</strong>
                    <span>{finding.caption}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <p className="tribe-modal__lens">{tribeSimulationMeta.researchLens}</p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TribeSimulationModal;
