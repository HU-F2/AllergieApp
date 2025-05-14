import CustomLocation from '../components/location/customLocation/CustomLocation';
import PollenInfo from '../components/PollenInfo';
import { useLocationContext } from '../contexts/LocationContext';
import Navbar from '../components/common/navigation/Navbar';
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
            <Navbar />
            <CustomLocation />
            <PollenInfo location={location} />
            <WeatherCard location={location} />
        </div>
    );
};

export default Home;
