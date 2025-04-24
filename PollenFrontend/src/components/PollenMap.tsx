import { MapContainer, TileLayer, Circle, Popup, Polygon } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import {
    useFetchPollenBorder,
    useFetchPollenMap,
} from '../services/pollenService';
import { TimeSlider } from './TimeSlider';

interface CityPollenData {
    city: string;
    latitude: number;
    longitude: number;
    birchPollen: number | null;
    time: string | null;
}

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

    // const { data: borderData } = useFetchPollenBorder();

    if (!data) {
        return <div>Loading...</div>;
    }
    const polygonCoordinates = data.map((pollenDataPoint) => ({
        // Coordinates mapping
        coordinates: pollenDataPoint.location.coordinates.map(
            (coord, index) =>
                [coord.latitude, coord.longitude] as LatLngExpression // flip [lng, lat] to [lat, lng]
        ),
        // Get color from the pollen data
        color: getColor(pollenDataPoint.hourly.birch_pollen[currentTime]),
    }));

    // console.log(polygonCoordinates);

    // useEffect(() => {
    //     if (data) {
    //         setCurrentTime(data[0].hourly.time[0]);
    //     }
    // }, [data]);
    return (
        <>
            <MapContainer
                center={center}
                zoom={7}
                style={{ height: '75vh', width: '100vw' }}
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
