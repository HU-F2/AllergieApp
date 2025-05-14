import Navbar from '../components/common/navigation/Navbar';
import PollenSelector from '../components/common/Selector/PollenSelector';

const ProfilePage = () => {
    return (
        <div className="home-container">
            <Navbar />
            <div>
                <div>
                    <h2>Mijn Pollenallergie</h2>
                    <PollenSelector />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
