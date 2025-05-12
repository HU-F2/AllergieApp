import CustomLocation from '../components/location/customLocation/CustomLocation';
import PollenInfo from '../components/PollenInfo';
import { useLocationContext } from '../contexts/LocationContext';
import Navbar from '../components/common/navigation/Navbar';

const Home = () => {
    const { location } = useLocationContext();

    return (
        <div className="home-container">
            <Navbar />
            <CustomLocation />
            <PollenInfo location={location} />
        </div>
    );
};

export default Home;
