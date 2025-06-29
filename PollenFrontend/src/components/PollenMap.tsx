import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import {
    MapContainer,
    Marker,
    Polygon,
    TileLayer,
    useMap,
} from 'react-leaflet';
import { useLocationContext } from '../contexts/LocationContext';
import { useSelectedPollenContext } from '../contexts/SelectedPollenContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { useFetchPollenMap } from '../services/pollenService';
import { useCurrentTime } from './hooks/useCurrentTime';
import { useThrottle } from './hooks/useThrottle';
import PollenLayerSelector from './PollenLayerSelector';
import { PollenLegenda } from './PollenLegenda';
import { TimeSlider } from './TimeSlider';

const getColor = (
    pollen: number | null | undefined,
    pollenType: PollenTypes,
    max: number = 30,
    darkMode: boolean = false
): string => {
    if (pollen == null) return darkMode ? 'rgb(80,80,80)' : 'rgb(240,240,240)';

    const baseColor = pollenMeta[pollenType].baseColor;
    const clampedPollen = Math.max(0, Math.min(max, pollen));
    const t = Math.pow(clampedPollen / max, 0.3);

    const startColor: [number, number, number] = darkMode
        ? [80, 80, 80]
        : [240, 240, 240];
    const interpolatedColor = startColor.map((start, i) =>
        Math.round(start + t * (baseColor[i] - start))
    ) as [number, number, number];

    return `rgb(${interpolatedColor[0]},${interpolatedColor[1]},${interpolatedColor[2]})`;
};

export const pollenMeta: Record<
    PollenTypes,
    {
        name: string;
        rawName: string;
        baseColor: [number, number, number];
        min: number;
        max: number;
    }
> = {
    birch_pollen: {
        name: '🌳 Berk 🟦',
        rawName: 'Berk',
        baseColor: [0, 0, 255],
        min: 0,
        max: 12,
    },
    grass_pollen: {
        name: '🌿 Gras 🟩',
        rawName: 'Gras',
        baseColor: [0, 128, 0],
        min: 0,
        max: 20,
    },
    alder_pollen: {
        name: '🌲 Els 🟧',
        rawName: 'Els',
        baseColor: [255, 165, 0],
        min: 0,
        max: 10,
    },
    mugwort_pollen: {
        name: '🌾 Bijvoet 🟫',
        rawName: 'Bijvoet',
        baseColor: [150, 75, 0],
        min: 0,
        max: 8,
    },
    olive_pollen: {
        name: '🫒 Olijf 🟪',
        rawName: 'Olijf',
        baseColor: [128, 0, 128],
        min: 0,
        max: 15,
    },
    ragweed_pollen: {
        name: '🌼 Ambrosia 🟨',
        rawName: 'Ambrosia',
        baseColor: [255, 255, 0],
        min: 0,
        max: 18,
    },
};

export enum PollenTypes {
    Birch = 'birch_pollen',
    Grass = 'grass_pollen',
    Alder = 'alder_pollen',
    Mugwort = 'mugwort_pollen',
    Olive = 'olive_pollen',
    Ragweed = 'ragweed_pollen',
}

export const PollenMap = () => {
    const { data } = useFetchPollenMap();
    const { selectedPollenType } = useSelectedPollenContext();
    const [polygonCoordinates, setPolygonCoordinates] = useState<Record<
        string,
        {
            coordinates: LatLngExpression[];
            color: string;
            id: string;
        }[]
    > | null>(null);
    const controlRef = useRef<L.Control.Layers | null>(null);
    const { location } = useLocationContext();
    const { isDarkMode } = useThemeContext();

    const [center, setCenter] = useState<LatLngExpression>([52.1, 5.1]);
    const [currentTime, setCurrentTime] = useCurrentTime(
        data && data[0] ? data[0].hourly.time : []
    );
    const throttledTime = useThrottle(currentTime, 200);

    const asyncProcessDataForType = (pollenType: PollenTypes) => {
        if (!data) return [];

        const coordinatesWithColors = data.map(({ location, hourly }) => {
            const { coordinates } = location;
            const pollenValue = hourly?.[pollenType]?.[currentTime] ?? null;
            const color = getColor(
                pollenValue,
                pollenType,
                pollenMeta[pollenType as PollenTypes].max,
                isDarkMode
            );

            return {
                coordinates: coordinates.map(
                    ({ latitude, longitude }) =>
                        [latitude, longitude] as LatLngExpression
                ),
                color,
                id: location.id,
            };
        });

        return coordinatesWithColors;
    };

    useEffect(() => {
        // Center map
        setCenter([location?.latitude ?? 52.1, location?.longitude ?? 5.1]);
    }, [location]);

    useEffect(() => {
        // Open legend by default
        const controlContainer = (controlRef.current as any)
            ?._container as HTMLElement;

        if (controlContainer) {
            controlContainer.classList.add('leaflet-control-layers-expanded');
        }
    }, [controlRef.current]);

    useEffect(() => {
        const processData = async () => {
            const processedData = asyncProcessDataForType(selectedPollenType);
            setPolygonCoordinates({
                [selectedPollenType]: processedData,
            });
        };

        processData();
    }, [data, selectedPollenType, throttledTime]);

    return (
        <div className="map-container2">
            <MapContainer
                center={center}
                zoom={11}
                style={{ height: '64vh', width: '100%', fontSize: '1.2rem' }}
                scrollWheelZoom={true}
            >
                <div className="time-overlay">
                    {data && data[0] && (
                        <div className="time-label">
                            {data[0].hourly.time[currentTime].split('T')[1]}
                        </div>
                    )}
                </div>
                <RecenterMap center={center} />
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    position={center}
                    title="Uw (geschatte) locatie"
                    icon={customDivIcon}
                />
                <PollenLayerSelector />
                {polygonCoordinates &&
                    polygonCoordinates[selectedPollenType as PollenTypes]?.map(
                        (polygon) => (
                            <Polygon
                                key={polygon.id}
                                positions={polygon.coordinates}
                                pathOptions={{
                                    color: polygon.color,
                                }}
                                stroke={false}
                                fillOpacity={0.8}
                            />
                        )
                    )}
                <PollenLegenda pollenType={selectedPollenType} />
            </MapContainer>

            {data && (
                <TimeSlider
                    times={data[0] ? data[0].hourly.time : []}
                    currentTime={currentTime}
                    onTimeChange={(timeIndex) => setCurrentTime(timeIndex)}
                />
            )}
        </div>
    );
};

type RecenterProps = {
    center: LatLngExpression;
};

const RecenterMap = ({ center }: RecenterProps) => {
    const map = useMap();

    useEffect(() => {
        map.setView(center);
    }, [center, map]);

    return null;
};

export const customDivIcon = L.divIcon({
    html: `<div class="custom-marker"></div>`,
    className: '', // remove default leaflet styles
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});
