import Navbar from '../components/common/navigation/Navbar';
import CustomLocation from '../components/location/customLocation/CustomLocation';
import PollenInfo from '../components/PollenInfo';
import { PollenMap, PollenTypes } from '../components/PollenMap';
import { WalkAdvice } from '../components/WalkAdviceScore';
import WeatherCard from '../components/weatherCard';
import { useLocationContext } from '../contexts/LocationContext';

const Home = () => {
    const { location } = useLocationContext();

    return (
        <div className="home-container">
            <Navbar />
            <div className="dashboard--layout">
                <div className="dashboard--left">
                    <h1 className="dashboard--current-location">
                        Pollen in {location?.name}:
                    </h1>
                    <CustomLocation />
                    <WalkAdvice pollenType={PollenTypes.Birch} pollenValue={0} weather={{
                        averageRain: 0,
                        averageTemperature: 0
                    }} location={location} />
                    <div className="dashboard--infoWeather">
                        <PollenInfo location={location} />
                        <div className="dashboard--weather-mobile">
                            <WeatherCard location={location} />
                        </div>
                    </div>
                </div>
                <div className="dashboard--right">
                    <PollenMap />
                    <div className="dashboard--weather-desktop">
                        <WeatherCard location={location} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
