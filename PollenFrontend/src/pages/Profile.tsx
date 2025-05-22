import Navbar from '../components/common/navigation/Navbar';
import PollenSelector from '../components/common/Selector/PollenSelector';
import ThemeToggle from '../components/common/theme/ThemeToggle';

const ProfilePage = () => {
    return (
        <div className="home-container">
            <Navbar />
            <div>
                <div>
                    <h2>Mijn Pollenallergie</h2>
                    <PollenSelector />
                </div>
                <div>
                    <h2>Theme Toggle</h2>
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
