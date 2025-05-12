import { NavLink } from 'react-router-dom';
import CustomLocation from '../components/location/customLocation/CustomLocation';
import PollenInfo from '../components/PollenInfo';
import { useLocationContext } from '../contexts/LocationContext';
import WeatherCard from '../components/weatherCard';
import { getThreeHourForecast, useFetchForecast } from '../services/weatherService';
import { useEffect, useState } from 'react';

const Home = () => {
    
    const { location } = useLocationContext();

    // const [weather, setWeather] = useState<WeatherData | null>(null);
    // const [error, setError] = useState('');

    // useEffect(() => {
    //     if (location) {
    //         getThreeHourForecast(location.latitude, location.longitude)
    //             .then(setWeather)
    //             .catch((err) => {
    //                 setError(err.message);
    //             });
    //     }
    // }, [location]);


    return (
        <div className="home-container">
            <CustomLocation />
            <PollenInfo location={location} />
            <WeatherCard location={location} />
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
