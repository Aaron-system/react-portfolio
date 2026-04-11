import AnimatedLetters from '../AnimatedLetters';
import './index.scss';
import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import Loader from 'react-loaders';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faReact,
  faHtml5,
  faCss3,
  faJsSquare,
  faPython,
  faGitAlt,
} from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import ChatPanel from './ChatPanel';
import PixelAvatar from './PixelAvatar';
import { skillTags } from './content';
import pixelBg from '../../platform.png';
import titleLegal from '../../assets/images/Legal Ai.png';
import titleSimulations from '../../assets/images/Simulations.png';
import titleBlockchain from '../../assets/images/Blockchain.png';
import titleRobotics from '../../assets/images/Robotics.png';

const About = () => {
  const [letterClass, setLetterClass] = useState('text-animate');
  const [avatarZone, setAvatarZone] = useState('box');
  const [activeZone, setActiveZone] = useState(null);
  const sceneRef = useRef(null);
  const boxRef = useRef(null);
  const lastZoneRef = useRef(null);
  const savedScrollRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleEscapeBox = useCallback(() => {
    // Lock the page scroll position before state change triggers re-render
    const page = document.querySelector('.page');
    if (page) savedScrollRef.current = page.scrollTop;
    setAvatarZone('scene');
  }, []);

  const handleZoneChange = useCallback((zone) => {
    const zoneId = zone?.id || null;
    if (zoneId !== lastZoneRef.current) {
      lastZoneRef.current = zoneId;
      setActiveZone(zone);
    }
  }, []);

  const handleReachEnd = useCallback(() => {
    const page = document.querySelector('.page');
    if (page) savedScrollRef.current = page.scrollTop;
    setAvatarZone('box');
    setActiveZone(null);
    lastZoneRef.current = null;
  }, []);

  // Restore scroll position synchronously after every avatarZone transition
  // so the page never jumps when the PixelAvatar mounts/unmounts
  useLayoutEffect(() => {
    const page = document.querySelector('.page');
    if (page) page.scrollTop = savedScrollRef.current;
  }, [avatarZone]);

  // Prevent arrow keys from ever scrolling the page on the About route.
  // The PixelAvatar handles movement; the page must never intercept these keys.
  useEffect(() => {
    const ARROW_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
    const block = (e) => {
      if (ARROW_KEYS.has(e.key)) e.preventDefault();
    };
    window.addEventListener('keydown', block, { passive: false });
    return () => window.removeEventListener('keydown', block);
  }, []);

  return (
    <>
      <div className="about-page">
        <span className="tags about-top-tag">&lt;body&gt;</span>
        <span className="tags about-bottom-tag">
          &lt;/body&gt;
          <br />
          <span className="bottom-tag-html">&lt;/html&gt;</span>
        </span>
        <div className="about-left">
          <div className="about-heading-row">
            <h1>
              <AnimatedLetters
                letterClass={letterClass}
                strArray={['<', 'A', 'b', 'o', 'u', 't']}
                idx={15}
              />
              {' '}
              <span className="about-title-accent">Me</span>
              {' '}
              <AnimatedLetters
                letterClass={letterClass}
                strArray={['/', '>']}
                idx={22}
              />
            </h1>

            <div className="stage-cube-cont">
              <div className="cubespinner">
                <div className="face1">
                  <FontAwesomeIcon icon={faReact} color="#5ED4F5" />
                </div>
                <div className="face2">
                  <FontAwesomeIcon icon={faCss3} color="#28A4D9" />
                </div>
                <div className="face3">
                  <FontAwesomeIcon icon={faGitAlt} color="#EC4D28" />
                </div>
                <div className="face4">
                  <FontAwesomeIcon icon={faHtml5} color="#F06529" />
                </div>
                <div className="face5">
                  <FontAwesomeIcon icon={faPython} color="#306998" />
                </div>
                <div className="face6">
                  <FontAwesomeIcon icon={faJsSquare} color="#EFD81D" />
                </div>
              </div>
            </div>
          </div>

          <div className="about-intro">
            <p>
              Hi, I&apos;m <strong>Aaron</strong> &mdash; a legal tech engineer and AI
              developer who builds software at the intersection of law +
              machine learning.
            </p>
            <p>
              My core work is in <strong>legal AI</strong> &mdash; contract
              intelligence, document automation, and NLP pipelines that help
              lawyers work faster. I also build <strong>simulation
              environments</strong> for agent-based modeling and reinforcement
              learning. On the side, I explore blockchain and robotics as
              creative experiments.
            </p>
          </div>

          <div className="about-skills">
            {skillTags.map((tag) => (
              <span
                key={tag.label}
                className="skill-chip"
                style={{ borderColor: tag.color, color: tag.color }}
              >
                {tag.label}
              </span>
            ))}
          </div>

          <div className="about-ctas">
            <a
              href="/resume.docx"
              download="Aaron_Kreidieh_Resume_2026.docx"
              className="about-btn about-btn--primary"
            >
              DOWNLOAD RESUME &darr;
            </a>
          </div>

          <div className="pixel-scene" ref={sceneRef}>
            <div className="zone-titles">
              <img src={titleLegal} alt="Legal AI" className={`zone-title${activeZone?.id === 'legal' ? ' zone-title--active' : ''}`} style={{ left: '3%', width: '22%' }} />
              <img src={titleSimulations} alt="Simulations" className={`zone-title${activeZone?.id === 'simulations' ? ' zone-title--active' : ''}`} style={{ left: '20%', width: '26%' }} />
              <img src={titleBlockchain} alt="Blockchain" className={`zone-title${activeZone?.id === 'blockchain' ? ' zone-title--active' : ''}`} style={{ left: '42%', width: '23%' }} />
              <img src={titleRobotics} alt="Robotics" className={`zone-title${activeZone?.id === 'robotics' ? ' zone-title--active' : ''}`} style={{ left: '60%', width: '28%' }} />
            </div>
            <img
              src={pixelBg}
              alt=""
              className="pixel-scene__bg"
              draggable={false}
            />
            {avatarZone === 'scene' && (
              <PixelAvatar
                zone="scene"
                boxRef={boxRef}
                sceneRef={sceneRef}
                onEscapeBox={handleEscapeBox}
                onZoneChange={handleZoneChange}
                onReachEnd={handleReachEnd}
              />
            )}
            <p className="pixel-scene__hint">
              Use arrow keys to walk across the city
            </p>
          </div>
        </div>

        <div className="about-right">
          {/* ChatPanel temporarily disabled pending Google Safe Browsing review */}
          <Link to="/contact" className="about-contact-btn">
            Contact Me
          </Link>
        </div>
      </div>

      <Loader type="pacman" />
    </>
  );
};

export default About;
