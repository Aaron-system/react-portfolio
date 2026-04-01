import './index.scss';
import { Link, NavLink } from 'react-router-dom';
import LogoS from '../../assets/images/aaronlogo.png'
import LongSubtitle from '../../assets/images/aaronsign.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser, faEnvelope, faBriefcase } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons';


const Sidebar = () => (
    <div className="nav-bar">
        <Link className='logo' to='/'>
            <img src={LogoS} alt="logo" />
            <img className="sub-logo" src={LongSubtitle} alt="Aaron K" />

        </Link>
        <nav>
            <NavLink
                to='/'
                end
                className={({ isActive }) => (isActive ? 'active' : undefined)}
                aria-label='Home'
            >
                <FontAwesomeIcon icon={faHome} />
            </NavLink>
            <NavLink
                to='/experience'
                className={({ isActive }) => `experience-link${isActive ? ' active' : ''}`}
                aria-label='Experience'
            >
                <FontAwesomeIcon icon={faBriefcase} />
            </NavLink>
            <NavLink
                to='/about'
                className={({ isActive }) => `about-link${isActive ? ' active' : ''}`}
                aria-label='About'
            >
                <FontAwesomeIcon icon={faUser} />
            </NavLink>
            <NavLink
                to='/contact'
                className={({ isActive }) => `contact-link${isActive ? ' active' : ''}`}
                aria-label='Contact'
            >
                <FontAwesomeIcon icon={faEnvelope} />
            </NavLink>

        </nav>

        <ul>
            <li>
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.youtube.com/channel/UC23mFNmDk-RqAZ6WUAc4Nfw"
                >
                    <FontAwesomeIcon icon={faYoutube} color='#808080' />
                </a>
            </li>


            <li>
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.linkedin.com/in/aaron-kreidieh-1383391ab/"
                >
                    <FontAwesomeIcon icon={faLinkedin} color='#808080' />
                </a>
            </li>
            <li>
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://github.com/Aaron-system"
                >
                    <FontAwesomeIcon icon={faGithub} color='#808080' />
                </a>
            </li>
        </ul>




    </div>
)

export default Sidebar