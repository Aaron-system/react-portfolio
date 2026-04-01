import './index.scss'
import Sidebar from '../Sidebar'
import { Outlet, useLocation } from 'react-router-dom'
import FloatingLines from '../FloatingLines'

const Layout = () => {
    const { pathname } = useLocation()
    const isExperiencePage = pathname === '/experience'
    const isAboutPage = pathname === '/about'

    return (
        <div className="App">
            <FloatingLines
                linesGradient={['#ffffff', '#9c9c9c', '#ffffff']}
                animationSpeed={1}
                interactive={false}
                bendRadius={15}
                bendStrength={2}
                mouseDamping={0.2}
                parallax
                parallaxStrength={1}
            />
            <Sidebar />
            <div className='page'>
                {!isExperiencePage && !isAboutPage && (
                    <span className='tags top-tags'>&lt;body&gt;</span>
                )}

                <Outlet />

                {!isExperiencePage && !isAboutPage && (
                    <span className='tags bottom-tags'>
                        &lt;/body&gt;
                        <br />
                        <span className='bottom-tag-html'>&lt;/html&gt;</span>
                    </span>
                )}
            </div>
        </div>
    )
}

export default Layout