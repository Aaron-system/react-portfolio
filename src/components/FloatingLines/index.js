import { useEffect, useRef } from 'react';
import './index.scss';

const FloatingLines = ({
  linesGradient = ['#ffffff', '#9c9c9c', '#ffffff'],
  animationSpeed = 1,
  interactive = false,
  bendRadius = 15,
  bendStrength = 2,
  mouseDamping = 0.2,
  parallax = true,
  parallaxStrength = 1,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext('2d');
    const pointer = { x: 0.5, y: 0.5 };
    const easedPointer = { x: 0.5, y: 0.5 };
    let frameId;

    const setCanvasSize = () => {
      const { innerWidth, innerHeight, devicePixelRatio = 1 } = window;

      canvas.width = innerWidth * devicePixelRatio;
      canvas.height = innerHeight * devicePixelRatio;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const handlePointerMove = (event) => {
      if (!interactive) {
        return;
      }

      pointer.x = event.clientX / window.innerWidth;
      pointer.y = event.clientY / window.innerHeight;
    };

    const draw = (time) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const speed = time * 0.00025 * animationSpeed;
      const gradient = context.createLinearGradient(0, 0, width, height);

      linesGradient.forEach((color, index) => {
        const stop = linesGradient.length === 1 ? 1 : index / (linesGradient.length - 1);
        gradient.addColorStop(stop, color);
      });

      easedPointer.x += (pointer.x - easedPointer.x) * mouseDamping;
      easedPointer.y += (pointer.y - easedPointer.y) * mouseDamping;

      context.clearRect(0, 0, width, height);
      context.strokeStyle = gradient;
      context.lineCap = 'round';

      const lineCount = 16;
      const spacing = height / (lineCount + 1);

      for (let lineIndex = 0; lineIndex < lineCount; lineIndex += 1) {
        const baseY = spacing * (lineIndex + 1);
        const opacity = 0.12 + (lineIndex / lineCount) * 0.2;
        const lineWidth = 1 + (lineIndex % 3) * 0.35;

        context.save();
        context.globalAlpha = opacity;
        context.lineWidth = lineWidth;
        context.beginPath();

        for (let x = -80; x <= width + 80; x += 24) {
          const progress = x / width;
          const waveA = Math.sin(progress * 6 + speed * 4 + lineIndex * 0.7) * 14;
          const waveB = Math.cos(progress * 12 - speed * 3 + lineIndex * 0.45) * 7;
          const drift = parallax
            ? Math.sin(speed * 2 + lineIndex * 0.4) * parallaxStrength * 6
            : 0;

          let y = baseY + waveA + waveB + drift;

          if (interactive) {
            const dx = x - easedPointer.x * width;
            const dy = y - easedPointer.y * height;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const influence = Math.exp(-distance / Math.max(60, bendRadius * 20));

            y -= influence * bendStrength * 18 * Math.sign(dy || 1);
          }

          if (x === -80) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
        }

        context.stroke();
        context.restore();
      }

      frameId = window.requestAnimationFrame(draw);
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    window.addEventListener('pointermove', handlePointerMove);
    frameId = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.cancelAnimationFrame(frameId);
    };
  }, [
    animationSpeed,
    bendRadius,
    bendStrength,
    interactive,
    linesGradient,
    mouseDamping,
    parallax,
    parallaxStrength,
  ]);

  return (
    <div className="floating-lines" aria-hidden="true">
      <canvas ref={canvasRef} className="floating-lines__canvas" />
    </div>
  );
};

export default FloatingLines;
