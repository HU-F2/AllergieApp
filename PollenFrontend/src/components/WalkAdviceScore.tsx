import { useState } from 'react';
import { calculateWalkScore } from '../utils/calculateWalkScore';
import { PollenTypes, pollenMeta } from './PollenMap';
import { useFetchForecast } from '../services/weatherService';
import { LocationData } from '../services/locationService';
import { useFetchPollenByLocation } from '../services/pollenService';

type Props = {
    pollenType: PollenTypes;
    // pollenValue: number;
    // weather: {
    //     averageRain: number;
    //     averageTemperature: number;
    // };
    location: LocationData | undefined;
};

export const WalkAdvice = ({ pollenType, location}: Props) => {
    const [expanded, setExpanded] = useState(false);
    const {data:weather} = useFetchForecast(location?.latitude,location?.longitude);
    const {data:pollenData} = useFetchPollenByLocation(location && {latitude:location.latitude,longitude:location.longitude})
    if (!weather) return null;
    if (!pollenData) return null;

    const score = calculateWalkScore({
        pollenType,
        pollenValue:pollenData?.hourly[pollenType]?.[0] ?? 0,
        averageRain: weather.averageRain,
        averageTemp: weather.averageTemperature
    });

    const { rawName } = pollenMeta[pollenType];

    const pollenConcentration = pollenData?.hourly[pollenType]?.[0] ?? 0;

    const pollenRatio = pollenConcentration / pollenMeta[pollenType].max;

    let pollenLabel = '';
    if (pollenRatio <= 0.1) {
        pollenLabel = 'Weinig';
    } else if (pollenRatio <= 0.4) {
        pollenLabel = 'Matige';
    } else {
        pollenLabel = 'Hoge';}

    const explanation = `${pollenLabel.charAt(0).toUpperCase() + pollenLabel.slice(1)} ${rawName.toLowerCase()}pollen, ${
    weather.averageRain <= 0.5 ? 'droog weer' : weather.averageRain <= 2.0 ? 'lichte neerslag' : 'zware neerslag'
    } en ${weather.averageTemperature.toFixed(1)}°C zorgen voor een ${
        score >= 8 ? 'ideaal' : score >= 5 ? 'redelijk' : 'ongunstig'
    } moment om naar buiten te gaan.`;

    let colorScoreCalculation = 'green'
    if (score >= 0 && score <= 4) {
        colorScoreCalculation = 'red'
    } else if (score > 4 && score <= 6) {
        colorScoreCalculation = 'orange'
    }

    return (
        <div className='walking-advice-card'>
            <h3 style={{ margin: 0, fontSize: '1.2rem'}}>
                🥾 Wandeladvies: <span style={{color:colorScoreCalculation}}>{score}/10</span>
            </h3>

            <button
                onClick={() => setExpanded(!expanded)}
                style={{
                marginTop: '12px',
                padding: '6px 12px',
                backgroundColor: '#fff',
                border: '2px solid rgb(232, 232, 232)',
                borderRadius: '6px',
                color: 'black',
                fontWeight: 'bold',
                cursor: 'pointer',
                }}
            >
                {expanded ? 'Minder uitleg' : 'Toon uitleg'}
            </button>

            {expanded && (
                <p style={{ marginTop: '12px', fontSize: '0.95rem' }}>
                {explanation}
                </p>
            )}
            </div>
    );
};
