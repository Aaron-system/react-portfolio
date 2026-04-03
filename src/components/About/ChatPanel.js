import { useState, useRef, useEffect } from 'react';
import { suggestedPrompts, contentGuides, defaultGreeting } from './content';
import PixelAvatar from './PixelAvatar';

const ZONE_TERMINAL = {
  legal: {
    title: 'LEGAL AI & CONTRACT INTELLIGENCE',
    lines: [
      '> initializing legal_ai_suite ...',
      '  ├─ contract_intelligence v2.4.1  ... loaded',
      '  ├─ clause_extraction_engine      ... OK',
      '  ├─ nlp_pipeline: transformer     ... active',
      '  ├─ compliance_checker v1.3.0     ... OK',
      '  └─ document_parser: pdf + docx   ... ready',
      '',
      '$ aaron.build("Legal AI")',
      '',
      '  → Automating contract review with NLP',
      '    and transformer-based models',
      '  → Building clause-extraction engines',
      '    that parse thousands of documents',
      '  → Smart compliance checking against',
      '    regulatory frameworks (GDPR, SOX)',
      '  → Legal document generation with',
      '    template-driven automation',
      '  → Connecting law firms to ML pipelines',
      '    for predictive case outcomes',
      '',
      '  status: deployed // 3 active projects',
    ],
  },
  simulations: {
    title: 'SIMULATIONS & NEURAL NETWORKS',
    lines: [
      '> initializing simulation_core ...',
      '  ├─ neural_networks v3.1.0       ... loaded',
      '  ├─ agent_based_modeling          ... OK',
      '  ├─ physics_engine: verlet        ... init',
      '  ├─ data_pipeline: streaming      ... active',
      '  └─ gpu_compute: CUDA 12.x       ... ready',
      '',
      '$ aaron.build("Simulations")',
      '',
      '  → Multi-agent system simulations',
      '    with emergent behavior modeling',
      '  → Deep learning architectures:',
      '    CNNs, RNNs, Transformers, GANs',
      '  → Real-time data visualization',
      '    dashboards with D3.js + WebGL',
      '  → Predictive modeling pipelines',
      '    for financial & scientific data',
      '  → Monte Carlo simulations for',
      '    risk assessment and optimization',
      '',
      '  status: active // 5 models in prod',
    ],
  },
  blockchain: {
    title: 'BLOCKCHAIN & WEB3 — EXPERIMENT',
    lines: [
      '> loading blockchain_lab ...',
      '  ├─ solidity_compiler 0.8.x      ... OK',
      '  ├─ web3_provider: ethers.js     ... connected',
      '  ├─ hardhat_framework            ... ready',
      '  └─ ipfs_gateway: pinata         ... standby',
      '',
      '$ aaron.explore("Blockchain")',
      '',
      '  → Smart contract development',
      '    with Solidity + Hardhat',
      '  → Built full-stack dApp frontends',
      '    with React + ethers.js + MetaMask',
      '  → Explored DeFi protocol patterns:',
      '    AMMs, token economics, governance',
      '  → On-chain data analysis and',
      '    transaction graph experiments',
      '',
      '  mode: exploration // side project',
    ],
  },
  robotics: {
    title: 'ROBOTICS & AUTOMATION — EXPERIMENT',
    lines: [
      '> loading robotics_lab ...',
      '  ├─ computer_vision: YOLOv8      ... OK',
      '  ├─ control_systems: PID + RL    ... loaded',
      '  ├─ ros2_bridge: humble          ... connected',
      '  └─ sensor_fusion: kalman         ... standby',
      '',
      '$ aaron.explore("Robotics")',
      '',
      '  → Experimenting with autonomous',
      '    navigation using SLAM and A*',
      '  → Computer vision integration:',
      '    object detection, pose estimation',
      '  → Hardware-software interfaces',
      '    with ROS2 and embedded C++',
      '  → Reinforcement learning for',
      '    adaptive robot control policies',
      '',
      '  mode: exploration // 2 prototypes',
    ],
  },
};

const API_URL = '/api/chat';

const localResponder = (question) => {
  const normalised = question.trim().toLowerCase();

  for (const [prompt, answer] of Object.entries(contentGuides)) {
    if (normalised === prompt.toLowerCase()) return answer;
  }

  for (const [prompt, answer] of Object.entries(contentGuides)) {
    const keywords = prompt
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3);
    const matches = keywords.filter((kw) => normalised.includes(kw));
    if (matches.length >= 2) return answer;
  }

  return null;
};

const ChatPanel = ({ boxRef, avatarZone, onEscapeBox, activeZone }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: defaultGreeting },
  ]);
  const [isOpen, setIsOpen] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [terminalLines, setTerminalLines] = useState([]);
  const [terminalVisible, setTerminalVisible] = useState(0);
  const [usedPrompts, setUsedPrompts] = useState(new Set());
  const messagesEndRef = useRef(null);
  const terminalEndRef = useRef(null);
  const localBoxRef = useRef(null);

  const activeBoxRef = boxRef || localBoxRef;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (activeZone && ZONE_TERMINAL[activeZone.id]) {
      const data = ZONE_TERMINAL[activeZone.id];
      setTerminalLines(data.lines);
      setTerminalVisible(0);
    } else {
      setTerminalLines([]);
      setTerminalVisible(0);
    }
  }, [activeZone]);

  useEffect(() => {
    if (terminalLines.length === 0 || terminalVisible >= terminalLines.length) return;
    const timer = setTimeout(() => {
      setTerminalVisible((prev) => prev + 1);
    }, 80);
    return () => clearTimeout(timer);
  }, [terminalLines, terminalVisible]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalVisible]);

  const handleSend = async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || isStreaming) return;

    const userMsg = { role: 'user', text: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    // Try local responder first for instant answers on exact matches
    const localAnswer = localResponder(trimmed);
    if (localAnswer) {
      setMessages((prev) => [...prev, { role: 'assistant', text: localAnswer }]);
      return;
    }

    // Use the AI API
    setIsStreaming(true);
    setMessages((prev) => [...prev, { role: 'assistant', text: '' }]);

    try {
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.text,
      }));

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);

      const { text } = await res.json();
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: 'assistant', text };
        return next;
      });
    } catch (err) {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: 'assistant',
          text: "I'm having trouble connecting right now. Try one of the suggested prompts or reach out via the Contact page.",
        };
        return next;
      });
    } finally {
      setIsStreaming(false);
    }
  };


  const inChatZone = activeZone?.id === 'chat';
  const showTerminal = avatarZone === 'scene' && terminalLines.length > 0 && !inChatZone;

  return (
    <div className={`chat-panel ${!isOpen ? 'chat-panel--collapsed' : ''}`}>
      <div
        className="chat-panel__header"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{ cursor: 'pointer' }}
      >
        <span className="chat-panel__status" />
        {showTerminal ? (
          <>TERMINAL <strong>{activeZone?.label?.toUpperCase() || ''}</strong></>
        ) : (
          <>CHAT WITH <strong>AARON</strong></>
        )}
        <div className="chat-panel__controls">
          <span>{isOpen ? '\u2013' : '\u25B2'}</span>
          <span>&#x25A1;</span>
          <span>&times;</span>
        </div>
      </div>

      {isOpen && (
        <>
          {showTerminal && (
            <div className="chat-panel__terminal">
              <div className="terminal-title">
                {ZONE_TERMINAL[activeZone.id]?.title}
              </div>
              {terminalLines.slice(0, terminalVisible).map((line, i) => (
                <div key={i} className="terminal-line">
                  {line || '\u00A0'}
                </div>
              ))}
              <span className="terminal-cursor">_</span>
              <div ref={terminalEndRef} />
            </div>
          )}

          {!showTerminal && (
            <div className="chat-panel__body">
              {avatarZone === 'box' && (
                <div
                  className="chat-panel__avatar-area"
                  ref={activeBoxRef}
                >
                  <PixelAvatar
                    zone="box"
                    boxRef={activeBoxRef}
                    onEscapeBox={onEscapeBox}
                  />
                  <span className="avatar-tap-hint">tap to move</span>
                </div>
              )}

              <div className="chat-panel__messages">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`chat-bubble chat-bubble--${msg.role}`}
                  >
                    {msg.text || (isStreaming && i === messages.length - 1 && msg.role === 'assistant'
                      ? <span className="thinking-dots"><span /><span /><span /></span>
                      : null
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {!showTerminal && (
            <>
              {suggestedPrompts.filter((p) => !usedPrompts.has(p)).length > 0 && (
                <div className="chat-panel__prompts">
                  {suggestedPrompts.filter((p) => !usedPrompts.has(p)).map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="chat-prompt-btn"
                      onClick={() => {
                        setUsedPrompts((prev) => new Set(prev).add(prompt));
                        handleSend(prompt);
                      }}
                    >
                      {prompt}
                      <span className="chat-prompt-btn__arrow">&rsaquo;</span>
                    </button>
                  ))}
                </div>
              )}

              <p className="chat-panel__footer">
                Select a prompt above to chat
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ChatPanel;
