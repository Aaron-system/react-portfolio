import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';

const featuredProjects = [
    {
        title: 'Horizon Legal Docs',
        category: 'Legal AI · Document Automation',
        image: '/HorizonLegal.png',
        link: 'https://horizonlegaldocs.online',
    },
    {
        title: 'Arbiter Legal AI',
        category: 'Legal AI · RAG · Multi-LLM',
        image: '/arbiter.png',
        link: 'https://arbiter.aaronk.tech',
    },
    {
        title: 'Neural Network Tribe Simulation',
        category: 'Python / ML',
        image: '/network_a38_t00400.png',
        blur: true,
        link: 'https://github.com/Aaron-system',
    },
    {
        title: 'Flask Blockchain',
        category: 'Python · Web3 · Distributed Systems',
        image: '/blockchain.png',
        link: 'https://github.com/Aaron-system',
    },
];

const Portfolio = () => {
    const navigate = useNavigate();

    const handleCardMove = (event) => {
        const { currentTarget, clientX, clientY } = event;
        const rect = currentTarget.getBoundingClientRect();
        const offsetX = (clientX - rect.left) / rect.width - 0.5;
        const offsetY = (clientY - rect.top) / rect.height - 0.5;

        currentTarget.style.setProperty('--card-rotate-x', `${offsetY * -6}deg`);
        currentTarget.style.setProperty('--card-rotate-y', `${offsetX * 8}deg`);
        currentTarget.style.setProperty('--card-shift-x', `${offsetX * 14}px`);
        currentTarget.style.setProperty('--card-shift-y', `${offsetY * 10}px`);
    };

    const resetCardMove = (event) => {
        const { currentTarget } = event;
        currentTarget.style.setProperty('--card-rotate-x', '0deg');
        currentTarget.style.setProperty('--card-rotate-y', '0deg');
        currentTarget.style.setProperty('--card-shift-x', '0px');
        currentTarget.style.setProperty('--card-shift-y', '0px');
    };



    return (
        <section className="portfolio-panel">
            <div className="portfolio-wrap">
                <div className="card-grid">
                    {featuredProjects.map((project) => {
                        const inner = (
                            <>
                                <div
                                    className="card__background"
                                    style={{
                                        backgroundImage: `url(${project.image})`,
                                        ...(project.blur ? {
                                            backgroundSize: '300%',
                                            backgroundPosition: 'center center',
                                            filter: 'brightness(0.95) saturate(0.9) contrast(1.05) blur(4px)',
                                            transform: 'scale(1.02)',
                                            backgroundColor: '#05041a',
                                        } : {}),
                                    }}
                                />
                                <div className="card__content">
                                    <p className="card__category">{project.category}</p>
                                    <h3 className="card__heading">{project.title}</h3>
                                    {project.placeholder && (
                                        <span className="card__coming-soon">Coming Soon</span>
                                    )}
                                    {project.link && (
                                        <span className="card__visit">Visit →</span>
                                    )}
                                </div>
                            </>
                        );

                        const sharedProps = {
                            key: project.title,
                            className: `card${project.placeholder ? ' card--placeholder' : ''}${project.link ? ' card--linked' : ''}`,
                            onMouseMove: handleCardMove,
                            onMouseLeave: resetCardMove,
                        };

                        return project.link ? (
                            <a
                                {...sharedProps}
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {inner}
                            </a>
                        ) : (
                            <article {...sharedProps}>{inner}</article>
                        );
                    })}

                    <button
                        type="button"
                        className="card card-button experience-card"
                        onClick={() => navigate('/experience')}
                        onMouseMove={handleCardMove}
                        onMouseLeave={resetCardMove}
                    >
                        <div className="experience-card__inner">
                            {[...Array(10)].map((_, i) => (
                                <span key={i} className="experience-card__particle" style={{ '--i': i }} />
                            ))}
                            <span className="experience-card__status" />
                            <p className="experience-card__label">EXPERIENCE</p>
                            <ul className="experience-card__preview">
                                <li>
                                    Legal Software Engineer{' '}
                                    <span>&mdash; Kreisson Legal</span>
                                </li>
                                <li>
                                    Helpdesk / Doc Automation{' '}
                                    <span>&mdash; LEAP Legal</span>
                                </li>
                                <li>
                                    Intern{' '}
                                    <span>&mdash; Lawpath</span>
                                </li>
                            </ul>
                            <p className="experience-card__hint">View full career log →</p>
                        </div>
                    </button>
                </div>
            </div>

        </section>
    );
};

export default Portfolio;
