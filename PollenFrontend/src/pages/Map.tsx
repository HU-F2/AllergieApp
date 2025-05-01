import { PollenMap } from '../components/PollenMap';
import Navbar from '../components/Navbar';

const MapPage = () => {
    return (
        <div className="map-container">
            <Navbar />
            <div className="">
                <h1 className="map-title">Pollen Map</h1>
            </div>            
            <PollenMap />
        </div>
    );
};

export default MapPage;
