import Navbar from '../components/common/navigation/Navbar';
import CustomLocation from '../components/location/customLocation/CustomLocation';
import PollenInfo from '../components/PollenInfo';
import { PollenMap } from '../components/PollenMap';
import { WalkAdvice } from '../components/WalkAdviceScore';
import WeatherCard from '../components/weatherCard';
import { useLocationContext } from '../contexts/LocationContext';
import { useSelectedPollenContext } from '../contexts/SelectedPollenContext';

const Home = () => {
    const { location } = useLocationContext();
    const { selectedPollenType } = useSelectedPollenContext();

    return (
        <>
            <Navbar />
            <div className="home-container">
                <div className="dashboard--layout">
                    <div className="dashboard--left">
                        <h1 className="dashboard--current-location">
                            Pollen in {location?.name}
                        </h1>
                        <WalkAdvice
                            pollenType={selectedPollenType}
                            location={location}
                        />
                        <div className="dashboard--infoWeather">
                            <PollenInfo location={location} />
                            <div className="dashboard--weather-mobile">
                                <WeatherCard location={location} />
                            </div>
                        </div>
                    </div>
                    <div className="dashboard--right">
                        <CustomLocation />
                        <PollenMap />
                        <div className="dashboard--weather-desktop">
                            <WeatherCard location={location} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
