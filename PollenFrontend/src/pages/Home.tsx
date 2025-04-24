import { NavLink } from 'react-router-dom';
import { PollenMap } from '../components/PollenMap';

const Home = () => {
    return (
        <div className="size-full">
            <h1>Home page</h1>
            <NavLink to="/about">Go to the about page</NavLink>
            <div className="map-container">
                <PollenMap />
            </div>
        </div>
    );
};

export default Home;
