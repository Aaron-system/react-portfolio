import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ImageLightbox.scss';

const ImageLightbox = ({ src, alt, caption, onClose }) => {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return createPortal(
    <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="Enlarged image">
      <button type="button" className="image-lightbox__backdrop" aria-label="Close" onClick={onClose} />
      <div className="image-lightbox__content">
        <button type="button" className="image-lightbox__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <img src={src} alt={alt} />
        {caption && <p className="image-lightbox__caption">{caption}</p>}
      </div>
    </div>,
    document.body
  );
};

export default ImageLightbox;
