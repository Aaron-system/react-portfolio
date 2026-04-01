import './index.scss'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import { useState, useEffect, useRef } from 'react'
import emailjs from 'emailjs-com'
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'




const Contact = () => {

    const [letterClass, setLetterClass] = useState('text-animate');
    const refForm = useRef();


    useEffect(() => {
        setTimeout(() => {
            setLetterClass('text-animate-hover')
        }, 3000)
    }, [])

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm(
                'service_8w4muzx',
                'template_ll12y5w',
                refForm.current,
                '6k5ociAeUUYISgV_7'
            )
            .then(
                () => {
                    alert('Email sent successfully!')
                    window.location.reload(false)
                },
                () => {
                    alert('Something went wrong, please try again later.')
                }

            )

    }


    return (

        <>
            <div className='container contact-page'>
                <div className="text-zone">
                    <h1>
                        <AnimatedLetters
                            letterClass={letterClass}
                            strArray={['C', 'o', 'n', 't', 'a', 'c', 't', ' ', 'M', 'e']}
                            idx={15}
                        />
                    </h1>
                    <p>I'm a passionate Fullstack developer with experience in Python, JavaScript, and various web development
                        frameworks including Django and React. I've built projects ranging from a Document Builder Application
                        to a Magic Memory Card Game. My skills also include neural network development, optical character
                        recognition, natural language processing, and AGLC4 Citator development. If you're interested in hiring
                        a skilled and dedicated developer, please feel free to contact me.
                    </p>


                    <div className='contact-form'>
                        <form ref={refForm} onSubmit={sendEmail}>
                            <ul>
                                <li className="half">
                                    <input type='text' name='name' placeholder="Name" required />
                                </li>

                                <li className="half">
                                    <input
                                        type='email'
                                        name='email'
                                        placeholder="Email"
                                        required />
                                </li>

                                <li>
                                    <input
                                        type='text'
                                        name='Subject'
                                        placeholder="Subject"
                                        required
                                    />
                                </li>

                                <li>
                                    <textarea
                                        name='message'
                                        placeholder="Message"
                                        required
                                    >
                                    </textarea>
                                </li>

                                <li>
                                    <button
                                        type='submit'
                                        className="flat-button1"
                                        value="SEND">CONTACT</button>
                                </li>


                            </ul>

                        </form>


                    </div>

                </div>

                <div className="info-map">
                    Aaron K
                    <br></br>
                    Sydney, Australia
                    <br></br>
                    <span>aaronfullstackdev777@gmail.com</span>
                </div>

                <div className='map-wrap'>
                    <MapContainer center={[-33.8567799, 151.213108]} zoom={10}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[-33.8567799, 151.213108]}>
                            <Popup>I live here!!</Popup>
                        </Marker>

                    </MapContainer>

                </div>

            </div>
            <Loader type="pacman" />


        </>



    )
}

export default Contact