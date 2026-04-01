import { useState, useEffect, useRef, useCallback } from 'react';

const WALK_FRAMES = 6;
const IDLE_FRAMES = 4;
const FRAME_INTERVAL = 130;
const MOVE_SPEED = 2.4;
const SPRITE_SIZE = 160;

function importAll(ctx) {
  const map = {};
  ctx.keys().forEach((key) => {
    map[key.replace('./', '')] = ctx(key);
  });
  return map;
}

const walkImages = importAll(
  require.context('../../pixel/animations/walk', true, /\.png$/)
);
const idleImages = importAll(
  require.context('../../pixel/animations/breathing-idle', true, /\.png$/)
);

const teleportGifs = importAll(
  require.context('../../pixel/animations/teleport', false, /\.gif$/)
);

function getTeleportSrc(direction) {
  const keys = Object.keys(teleportGifs);
  const match = keys.find((k) => k.toLowerCase().includes(direction));
  return match ? teleportGifs[match] : null;
}

const TELEPORT_DURATION = 800;

function getFrameSrc(type, direction, frameIndex) {
  const maxFrames = type === 'walk' ? WALK_FRAMES : IDLE_FRAMES;
  const safeIndex = frameIndex % maxFrames;
  const padded = String(safeIndex).padStart(3, '0');
  const key = `${direction}/frame_${padded}.png`;
  const src = type === 'walk' ? walkImages[key] : idleImages[key];
  if (!src) {
    const fallback =
      type === 'walk'
        ? walkImages['south/frame_000.png']
        : idleImages['south/frame_000.png'];
    return fallback;
  }
  return src;
}

const KEY_DIR_MAP = {
  ArrowUp: 'north',
  ArrowDown: 'south',
  ArrowLeft: 'west',
  ArrowRight: 'east',
};

const COMBO_DIR_MAP = {
  'ArrowUp+ArrowRight': 'north-east',
  'ArrowUp+ArrowLeft': 'north-west',
  'ArrowDown+ArrowRight': 'south-east',
  'ArrowDown+ArrowLeft': 'south-west',
};

const DIR_VELOCITY = {
  north:        { dx:  0,     dy: -1 },
  south:        { dx:  0,     dy:  1 },
  east:         { dx:  1,     dy:  0 },
  west:         { dx: -1,     dy:  0 },
  'north-east': { dx:  0.707, dy: -0.707 },
  'north-west': { dx: -0.707, dy: -0.707 },
  'south-east': { dx:  0.707, dy:  0.707 },
  'south-west': { dx: -0.707, dy:  0.707 },
};

const SCENE_SPRITE = 120;

const PATH_POINTS = [
  { xPct: 0,    yPct: 47.0 },
  { xPct: 72,   yPct: 46.5 },
  { xPct: 85,   yPct: 34.0 },
  { xPct: 100,  yPct: 34.0 },
];

function getGroundY(x, sceneW, sceneH) {
  const xPct = (x / sceneW) * 100;
  for (let i = 1; i < PATH_POINTS.length; i++) {
    const prev = PATH_POINTS[i - 1];
    const curr = PATH_POINTS[i];
    if (xPct <= curr.xPct) {
      const t = (xPct - prev.xPct) / (curr.xPct - prev.xPct);
      const yPct = prev.yPct + (curr.yPct - prev.yPct) * t;
      return (yPct / 100) * sceneH;
    }
  }
  const last = PATH_POINTS[PATH_POINTS.length - 1];
  return (last.yPct / 100) * sceneH;
}

const PLATFORM_ZONES = [
  { id: 'legal',       startPct: 0,  endPct: 22,  label: 'Legal AI' },
  { id: 'simulations', startPct: 22, endPct: 42,  label: 'Simulations' },
  { id: 'blockchain',  startPct: 42, endPct: 65,  label: 'Blockchain' },
  { id: 'robotics',    startPct: 65, endPct: 85,  label: 'Robotics' },
  { id: 'chat',        startPct: 85, endPct: 100, label: 'Chat' },
];

function getActiveZone(x, sceneW) {
  const xPct = (x / sceneW) * 100;
  return PLATFORM_ZONES.find((z) => xPct >= z.startPct && xPct < z.endPct) || null;
}

// Detect mobile once at module level — avoids repeated matchMedia calls in RAF
// Only use matchMedia (viewport width), NOT ontouchstart — touchscreen laptops
// report ontouchstart=true but are still desktop and need keyboard controls.
const isMobileDevice = () =>
  window.matchMedia('(max-width: 768px)').matches;

const PixelAvatar = ({ zone, boxRef, sceneRef, onEscapeBox, onZoneChange, onReachEnd }) => {
  // Stable ref so animation loop always sees the current value
  const isMobile = useRef(isMobileDevice());

  // Where the user tapped (mobile only)
  const tapTargetRef = useRef(null);

  const posRef = useRef({ x: 70, y: 100 });
  const [renderPos, setRenderPos] = useState({ x: 70, y: 100 });
  const [direction, setDirection] = useState('south');
  const [frameIndex, setFrameIndex] = useState(0);
  const [mode, setMode] = useState('idle');
  const [teleporting, setTeleporting] = useState(false);
  const [teleportDir, setTeleportDir] = useState('east');
  const keysDown = useRef(new Set());
  const moveLoopRef = useRef(null);

  // ── Mobile: center-spawn ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isMobile.current) return;
    const container = boxRef?.current;
    if (!container) return;

    // Wait one frame so the container has rendered dimensions
    const raf = requestAnimationFrame(() => {
      const cx = container.offsetWidth / 2;
      const cy = container.offsetHeight / 2;
      posRef.current = { x: cx, y: cy };
      setRenderPos({ x: cx, y: cy });
    });
    return () => cancelAnimationFrame(raf);
  }, [boxRef]);

  // ── Mobile: tap-to-move ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isMobile.current) return;
    const container = boxRef?.current;
    if (!container) return;

    const onTouchEnd = (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      const rect = container.getBoundingClientRect();
      tapTargetRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    };

    container.addEventListener('touchend', onTouchEnd, { passive: false });
    return () => container.removeEventListener('touchend', onTouchEnd);
  }, [boxRef]);

  // ── Desktop: keyboard listeners ────────────────────────────────────────────
  const getComboDirection = useCallback(() => {
    const keys = keysDown.current;
    const sorted = [...keys].sort().join('+');
    if (COMBO_DIR_MAP[sorted]) return COMBO_DIR_MAP[sorted];
    for (const key of keys) {
      if (KEY_DIR_MAP[key]) return KEY_DIR_MAP[key];
    }
    return null;
  }, []);

  useEffect(() => {
    if (isMobile.current) return;
    const onKeyDown = (e) => {
      if (!KEY_DIR_MAP[e.key]) return;
      e.preventDefault();
      keysDown.current.add(e.key);
    };
    const onKeyUp = (e) => {
      keysDown.current.delete(e.key);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // ── Animation / movement tick ──────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      if (teleporting) {
        moveLoopRef.current = requestAnimationFrame(tick);
        return;
      }

      // ── Mobile path: move towards tapped position ──────────────────────────
      if (isMobile.current) {
        const target = tapTargetRef.current;
        const container = boxRef?.current;

        if (target && container) {
          const prev = posRef.current;
          const w = container.offsetWidth;
          const h = container.offsetHeight;
          const dx = target.x - prev.x;
          const dy = target.y - prev.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 4) {
            const speed = MOVE_SPEED * 1.6;
            const nx = prev.x + (dx / dist) * speed;
            const ny = prev.y + (dy / dist) * speed;

            // Keep inside the box
            const clampedX = Math.max(SPRITE_SIZE * 0.25, Math.min(w - SPRITE_SIZE * 0.25, nx));
            const clampedY = Math.max(SPRITE_SIZE * 0.25, Math.min(h - SPRITE_SIZE * 0.25, ny));

            // Pick a cardinal direction to face
            const dir =
              Math.abs(dx) >= Math.abs(dy)
                ? dx > 0 ? 'east' : 'west'
                : dy > 0 ? 'south' : 'north';

            posRef.current = { x: clampedX, y: clampedY };
            setRenderPos({ x: clampedX, y: clampedY });
            setDirection(dir);
            setMode('walk');
          } else {
            // Arrived — clear target and stop
            tapTargetRef.current = null;
            setMode((prev) => (prev === 'walk' ? 'idle' : prev));
          }
        } else {
          setMode((prev) => (prev === 'walk' ? 'idle' : prev));
        }

        moveLoopRef.current = requestAnimationFrame(tick);
        return;
      }

      // ── Desktop path: keyboard movement + teleport ─────────────────────────
      const dir = getComboDirection();

      if (dir) {
        const vel = DIR_VELOCITY[dir];
        const prev = posRef.current;
        let nextX = prev.x + vel.dx * MOVE_SPEED;
        let nextY = prev.y + vel.dy * MOVE_SPEED;

        if (zone === 'box') {
          const container = boxRef?.current;
          if (container) {
            const w = container.offsetWidth;
            const h = container.offsetHeight;

            if (nextX > w * 0.75) {
              if (onEscapeBox && !teleporting) {
                setTeleporting(true);
                setTeleportDir('south');
                setTimeout(() => {
                  setTeleporting(false);
                  onEscapeBox();
                }, TELEPORT_DURATION);
              }
              moveLoopRef.current = requestAnimationFrame(tick);
              return;
            }
            nextX = Math.max(0, nextX);
            nextY = Math.max(0, Math.min(h, nextY));
          }
        } else {
          const scene = sceneRef?.current;
          if (scene) {
            const w = scene.offsetWidth;
            const h = scene.offsetHeight;
            nextX = Math.max(SCENE_SPRITE * 0.3, Math.min(w - SCENE_SPRITE * 0.3, nextX));
            nextY = getGroundY(nextX, w, h);
            if (onZoneChange) {
              const active = getActiveZone(nextX, w);
              onZoneChange(active);
            }
            if (onReachEnd && nextX >= w - SCENE_SPRITE * 1.2 && !teleporting) {
              setTeleporting(true);
              setTeleportDir('south');
              setTimeout(() => {
                setTeleporting(false);
                onReachEnd();
              }, TELEPORT_DURATION);
              moveLoopRef.current = requestAnimationFrame(tick);
              return;
            }
          }
        }

        posRef.current = { x: nextX, y: nextY };
        setRenderPos({ x: nextX, y: nextY });
        setDirection(dir);
        setMode('walk');
      } else {
        setMode((prev) => {
          if (prev === 'walk' && zone === 'scene') setDirection('south');
          return prev === 'walk' ? 'idle' : prev;
        });
      }

      moveLoopRef.current = requestAnimationFrame(tick);
    };

    moveLoopRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(moveLoopRef.current);
  }, [getComboDirection, zone, boxRef, sceneRef, onEscapeBox, onZoneChange, onReachEnd, teleporting]);

  // ── Frame cycling ──────────────────────────────────────────────────────────
  useEffect(() => {
    const maxFrames = mode === 'walk' ? WALK_FRAMES : IDLE_FRAMES;
    const id = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % maxFrames);
    }, FRAME_INTERVAL);
    return () => clearInterval(id);
  }, [mode]);

  // ── Desktop: scene entry teleport ──────────────────────────────────────────
  const teleportTo = useCallback((x, y) => {
    posRef.current = { x, y };
    setRenderPos({ x, y });
  }, []);

  useEffect(() => {
    if (isMobile.current) return; // scene never shows on mobile
    if (zone === 'scene' && sceneRef?.current) {
      const scene = sceneRef.current;
      const startX = SCENE_SPRITE * 0.6;
      const groundY = getGroundY(startX, scene.offsetWidth, scene.offsetHeight);
      teleportTo(startX, groundY);
      setDirection('east');
      scene.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [zone, sceneRef, teleportTo]);

  // ── Render ─────────────────────────────────────────────────────────────────
  const teleportSrc = teleporting ? getTeleportSrc(teleportDir) : null;
  const spriteSrc = getFrameSrc(
    mode === 'walk' ? 'walk' : 'breathing-idle',
    direction,
    frameIndex
  );
  const src = teleportSrc || spriteSrc;

  const baseSize = zone === 'scene' ? SCENE_SPRITE : SPRITE_SIZE;
  const size = teleporting ? baseSize * 1.4 : baseSize;

  return (
    <img
      src={src}
      alt="Pixel Aaron"
      className="pixel-avatar"
      style={{
        position: 'absolute',
        left: `${renderPos.x}px`,
        top: `${renderPos.y}px`,
        transform: 'translate(-50%, -50%)',
        width: `${size}px`,
        height: `${size}px`,
        imageRendering: 'pixelated',
        pointerEvents: 'none',
      }}
    />
  );
};

export default PixelAvatar;
