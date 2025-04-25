import { NavLink } from 'react-router-dom';
import { PollenMap } from '../components/PollenMap';

const MapPage = () => {
    return (
        <div className="map-container">
            <NavLink to="/">Terug naar home</NavLink>
            <h1>Pollen Map</h1>
            <PollenMap />
        </div>
    );
};

export default MapPage;
