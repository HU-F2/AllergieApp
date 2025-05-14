// src/components/WeatherCard.jsx
import React from 'react';
import { useFetchForecast } from '../services/weatherService';
import { LocationData } from '../services/locationService';

type Props = {
    location: LocationData | undefined;
};

const WeatherCard = ({location}:Props) => {
    const {data:weather} = useFetchForecast(location?.latitude,location?.longitude);
    
    if (!weather) return null;
  
    return (
      <div style={{
        border: '2px solid #4a90e2',
        borderRadius: '12px',
        padding: '16px',
        backgroundColor: '#eef6fd',
        color: '#333',
        maxWidth: '300px',
        margin: '0 auto'
      }}>
        <h3>Weer - Komende 3 uur</h3>
        <p>🌡️ Gem. Temperatuur: {weather.averageTemperature.toFixed(1)}°C</p>
        <p>💧 Gem. Neerslag: {weather.averageRain.toFixed(1)} mm</p>
        <p>💨 Gem. Wind: {weather.averageWind.toFixed(1)} km/u</p>
      </div>
    );
  };
  
  export default WeatherCard;
  
