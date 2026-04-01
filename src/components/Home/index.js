// import LogoTitle from '../../assets/images/logo-s.png';
import { Link } from 'react-router-dom';
import AnimatedLetters from '../AnimatedLetters';
import { useState, useEffect } from 'react';
import './index.scss';
import Logo from './Logo';
import Loader from 'react-loaders'
import Portfolio from './Portfolio'


const Home = () => {

    const [letterClass, setLetterClass] = useState('text-animate');

    const nameArray = [" ", "A", "a", "r", "o", "n"];
    const jobArray = ["a", " ", "F", "u", "l", "l", "s", "t", "a", "c", "k", " ", "D", "e", "v", "."];

    useEffect(() => {
        setTimeout(() => {
            setLetterClass('text-animate-hover')
        }, 4000)
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
                            idx={16} />
                        <br />
                        <AnimatedLetters letterClass={letterClass}
                            strArray={jobArray}
                            idx={16} />
                    </h1>

                    <h2>Fullstack Developer / Javascript / Python</h2>
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