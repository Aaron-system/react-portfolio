import AnimatedLetters from '../AnimatedLetters';
import './index.scss';
import { useState, useEffect } from 'react';
import Loader from 'react-loaders'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faReact,
    faHtml5,
    faCss3,
    faJsSquare,
    faPython,
    faGitAlt,
} from '@fortawesome/free-brands-svg-icons'



const About = () => {

    const [letterClass, setLetterClass] = useState('text-animate');

    useEffect(() => {
        setTimeout(() => {
            setLetterClass('text-animate-hover')
        }, 3000)
    }, [])




    return (
        <>
            <div className={'container about-page'}>
                <div className='text-zone'>
                    <h1>
                        <AnimatedLetters
                            letterClass={letterClass}
                            strArray={['A', 'b', 'o', 'u', 't', ' ', 'M', 'e']}
                            idx={15}
                        />
                    </h1>

                    <p>
                        As a Fullstack developer, I bring a diverse skill set and a deep passion for software development to any organization. With extensive experience in web development, including HTML5, CSS, JSON, and the Document Object Model, I'm well-versed in popular frameworks like Django, Flask, and React. My programming skills also extend to Python, JavaScript, and Solidity.

                    </p>
                    <p>
                        I've tackled complex projects, including developing neural networks for reading hand-written digits with TensorFlow and using Optical Character Recognition (OCR) with Pytesseract. I've also created blockchain applications using Flask and worked on natural language processing with Hugging Face using TensorFlow. Not to mention, I've built exciting applications such as a Google Docs clone, a Magic Memory card game, and AGLC4 Citator.

                    </p>
                    <p>
                        In addition to my technical expertise, I'm passionate about the social sciences and humanities, which helps me build more intuitive and user-friendly software. My interests in economics, evolutionary psychology, and anthropology drive my curiosity to collaborate with people from different backgrounds and perspectives. I'm thrilled to bring my innovative software development skills and diverse experience to any team and contribute to their success.


                    </p>

                </div>


                <div className='stage-cube-cont'>
                    <div className="cubespinner">
                        <div className="face1">
                            <FontAwesomeIcon icon={faReact} color="#5ED4F4" />
                        </div>
                        <div className="face2">
                            <FontAwesomeIcon icon={faCss3} color="#28A4D9" />
                        </div>
                        <div className="face3">
                            <FontAwesomeIcon icon={faGitAlt} color="#EC4V28" />
                        </div>
                        <div className="face4">
                            <FontAwesomeIcon icon={faHtml5} color="#F06529" />
                        </div>
                        <div className="face5">
                            <FontAwesomeIcon icon={faPython} color="#104E8B" />
                        </div>
                        <div className="face6">
                            <FontAwesomeIcon icon={faJsSquare} color="#EFD81D" />
                        </div>
                    </div>
                </div>

            </div>
            <Loader type="pacman" />
        </>
    );
};

export default About;