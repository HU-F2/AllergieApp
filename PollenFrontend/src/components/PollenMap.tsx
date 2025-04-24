import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { MapContainer, Polygon, TileLayer } from 'react-leaflet';
import { useFetchPollenMap } from '../services/pollenService';
import { TimeSlider } from './TimeSlider';

const getColor = (pollen: number | null | undefined): string => {
    if (pollen === null || pollen === undefined) return 'gray';

    const clamped = Math.max(0, Math.min(pollen, 50));

    const r = Math.round((clamped / 50) * 255);
    const g = Math.round((1 - clamped / 50) * 255);
    const b = 0;

    return `rgb(${r}, ${g}, ${b})`;
};

export const PollenMap = () => {
    const { data } = useFetchPollenMap();
    const [currentTime, setCurrentTime] = useState(0);
    const center: LatLngExpression = [52.1, 5.1];

    const polygonCoordinates = data?.map(
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
        <div className="map-container">
            <MapContainer
                center={center}
                zoom={7}
                style={{
                    width: '80vh',
                    height: '80vh',
                    maxWidth: '100%',
                    maxHeight: '80vh',
                    objectFit: 'cover',
                }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {polygonCoordinates?.map((polygon) => (
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
        </div>
    );
};
