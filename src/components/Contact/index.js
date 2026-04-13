import './index.scss'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'




const Contact = () => {

    const [letterClass, setLetterClass] = useState('text-animate');
    const refForm = useRef();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const emailServiceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const emailTemplateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const emailPublicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;


    useEffect(() => {
        setTimeout(() => {
            setLetterClass('text-animate-hover')
        }, 3000)
    }, [])

    const sendEmail = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            await emailjs.sendForm(
                emailServiceId,
                emailTemplateId,
                refForm.current,
                emailPublicKey
            );

            refForm.current.reset();
            setSubmitStatus({
                type: 'success',
                message: 'Thanks for reaching out. Your message has been sent.',
            });
        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: 'Something went wrong while sending your message. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }

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
                    <p>
                        I&apos;m a fullstack developer specializing in legal software automation
                        and AI-driven systems. I build tools that streamline contract intelligence,
                        document generation, and compliance workflows &mdash; combining NLP,
                        machine learning, and modern web frameworks to solve real problems
                        in law and beyond. Whether it&apos;s a new project, collaboration, or
                        just a conversation about tech, I&apos;d love to hear from you.
                    </p>
                    <p className="contact-availability">
                        I&apos;m also open to <strong>consulting</strong>, <strong>contract</strong>, and <strong>freelance</strong> engagements &mdash; feel free to reach out.
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
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'SENDING...' : 'CONTACT'}
                                    </button>
                                </li>

                                {submitStatus && (
                                    <li className={`form-status ${submitStatus.type}`}>
                                        {submitStatus.message}
                                    </li>
                                )}

                            </ul>

                        </form>


                    </div>

                </div>

                <div className="info-map">
                    Aaron K
                    <br></br>
                    Sydney, Australia
                    <br></br>
                    <span>aaron.kreidieh@gmail.com</span>
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