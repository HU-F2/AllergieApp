import { NavLink } from 'react-router-dom';
import CustomLocation from '../components/location/customLocation/CustomLocation';
import PollenInfo from '../components/PollenInfo';
import { useLocationContext } from '../contexts/LocationContext';

const Home = () => {
    const { location } = useLocationContext();

    return (
        <div className="home-container">
            <CustomLocation />
            <PollenInfo location={location} />
            <div className="menu">
                <NavLink to="/map" className="link-button green">
                    Bekijk Pollen Kaart
                </NavLink>
                <NavLink to="/education" className="link-button green">
                    Bekijk Educatie
                </NavLink>
                <NavLink to="/flora-pollen-info" className="link-button green">
                    Bekijk Flora Pollen Informatie
                </NavLink>
            </div>
        </div>
    );
};

export default Home;
