// import LogoTitle from '../../assets/images/logo-s.png';
import { Link } from 'react-router-dom';
import AnimatedLetters from '../AnimatedLetters';
import { useState, useEffect } from 'react';
import './index.scss';
import Loader from 'react-loaders'
import Portfolio from './Portfolio'


const Home = () => {

    const [letterClass, setLetterClass] = useState('text-animate');

    const nameArray = [" ", "A", "a", "r", "o", "n"];
    const jobLine1 = ["a", " ", "L", "e", "g", "a", "l", " ", "T", "e", "c", "h", " ", "+"];
    const jobLine2 = ["A", "I", " ", "D", "e", "v", "e", "l", "o", "p", "e", "r", "."];

    useEffect(() => {
        setTimeout(() => {
            setLetterClass('text-animate-hover')
        }, 6000)
    }, [])


    return (
        <>
            <div className="container home-page">
                <div className="text-zone">
                    <h1>
                        <span className={letterClass}>H</span>
                        <span className={`${letterClass} _12`}>i</span>
                        <span className={`${letterClass} _13`}>,</span>
                        <br />
                        <span className={`${letterClass} _14`}>I</span>
                        <span className={`${letterClass} _15`}>'</span>
                        <span className={`${letterClass} _16`}>m</span>


                        {/* <img src={LogoTitle} alt="developer" /> */}
                        <AnimatedLetters letterClass={letterClass}
                            strArray={nameArray}
                            idx={17} />
                        <br />
                        <AnimatedLetters letterClass={letterClass}
                            strArray={jobLine1}
                            idx={23} />
                        <br />
                        <AnimatedLetters letterClass={letterClass}
                            strArray={jobLine2}
                            idx={37} />
                    </h1>

                    <h2>Building intelligent systems across legal AI, simulations, and full-stack development.</h2>
                    <p className="credibility-strip">
                        <span>Legal Software Engineer</span>
                        <span>Freelance</span>
                        <span>Open to Consulting &amp; Contract</span>
                    </p>
                    <a
                        href="https://github.com/Aaron-system"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="github-link"
                    >
                        Browse GitHub
                    </a>
                    <Link to="/contact" className="flat-button">CONTACT ME</Link>


                </div>
                {/* <Logo /> */}

                {/* <div style={{ width: '50%' }}><Portfolio /></div> */}

                <Portfolio />


            </div>
            <Loader type="pacman" />
        </>
    )
}

export default Home 