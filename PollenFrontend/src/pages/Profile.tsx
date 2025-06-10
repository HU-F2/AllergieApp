import Navbar from '../components/common/navigation/Navbar';
import PollenSelector from '../components/common/Selector/PollenSelector';
import DarkModeSwitch from '../components/DarkModeSwitch';

const ProfilePage = () => {
    return (
        <>
            <Navbar />
            <div className="home-container">
                <div>
                    <div>
                        <h2>Mijn Pollenallergie</h2>
                        <PollenSelector />
                    </div>
                    <div>
                        <h2>Donkere modus</h2>
                        <DarkModeSwitch />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
