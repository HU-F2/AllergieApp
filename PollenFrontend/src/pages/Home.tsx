// src/pages/Home.tsx

import { NavLink } from 'react-router-dom';
import { PollenMap } from '../components/PollenMap';

const Home = () => {
    return (
        <div className="home-container">
            <h1 className="home-title">Polinator</h1>
            <div className="menu">
                <NavLink to="/map" className="link-button green">
                    View Pollen Map
                </NavLink>
            </div>
        </div>
    );
};

export default Home;
