import { NavLink } from 'react-router-dom';
import PollenInfo from '../components/PollenInfo';

const Home = () => {
    return (
        <div className="home-container">
            <PollenInfo />
            <div className="menu">
                <NavLink to="/map" className="link-button green">
                    View Pollen Map
                </NavLink>
                <NavLink to="/education" className="link-button green">
                    View eduction
                </NavLink>
            </div>
        </div>
    );
};

export default Home;
