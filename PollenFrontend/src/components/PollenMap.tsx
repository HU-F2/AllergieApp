import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { MapContainer, Polygon, TileLayer } from 'react-leaflet';
import { useFetchPollenMap } from '../services/pollenService';
import { TimeSlider } from './TimeSlider';

const getColor = (pollen: number | null | undefined): string => {
    if (pollen === null || pollen === undefined) return 'gray';

    // Clamp pollen between 0 and 50
    const clamped = Math.max(0, Math.min(pollen, 50));

    // Interpolate between green (0, 255, 0) and red (255, 0, 0)
    const r = Math.round((clamped / 50) * 255);
    const g = Math.round((1 - clamped / 50) * 255);
    const b = 0;

    return `rgb(${r}, ${g}, ${b})`;
};

export function getCurrentIsoHourString(): string {
    const now = new Date();
    return now.toISOString().slice(0, 16);
}

export const PollenMap = () => {
    const { data } = useFetchPollenMap();
    const [currentTime, setCurrentTime] = useState(0);
    const center: LatLngExpression = [52.1, 5.1];

    if (!data) {
        return <div>Loading...</div>;
    }
    const polygonCoordinates = data.map(
        ({ location, hourly: { birch_pollen } }) => {
            const { coordinates } = location;

            return {
                coordinates: coordinates.map(
                    ({ latitude, longitude }) =>
                        [latitude, longitude] as LatLngExpression
                ),
                color: getColor(birch_pollen[currentTime]),
            };
        }
    );

    return (
        <>
            <MapContainer
                center={center}
                zoom={7}
                style={{ height: '100vh', width: '100vw' }}
                scrollWheelZoom={true} // add this to avoid warnings
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {polygonCoordinates.map((polygon) => (
                    <Polygon
                        key={polygon.coordinates.length}
                        positions={polygon.coordinates}
                        pathOptions={{ color: polygon.color }}
                        stroke={false}
                    />
                ))}
            </MapContainer>
            {data && (
                <TimeSlider
                    times={data![0].hourly.time}
                    onTimeChange={(timeIndex) => setCurrentTime(timeIndex)}
                />
            )}
        </>
    );
};
