import logoimg from '../assets/LSH_logo.png';
import './splashScreen.css';

function SplashScreen({ isFadingOut = false } = {}) {
    return (
        <div className={`splash-screen ${isFadingOut ? 'blur-out' : ''}`}>
            <div className='splash-logo-container'>
                <img src={logoimg} alt="LSH LOGO" />
            </div>
            <div className='splash-title-box'>
                <h1>LIVING STONE</h1>
                <h1>HYMNS</h1>
            </div>
        </div>
    );
}

export default SplashScreen;