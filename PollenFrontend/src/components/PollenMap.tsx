import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import {
    LayerGroup,
    LayersControl,
    MapContainer,
    Polygon,
    TileLayer,
    useMapEvents,
} from 'react-leaflet';
import { useFetchPollenMap } from '../services/pollenService';
import { TimeSlider } from './TimeSlider';
import { useThrottle } from './hooks/useThrottle';

const getColor = (
    pollen: number | null | undefined,
    pollenType: PollenTypes
): string => {
    if (pollen === null || pollen === undefined) return 'gray';

    const clamped = Math.max(0, Math.min(pollen, 50));
    const normalized = clamped / 50;
    const exponent = 0.5;
    const intensity = Math.pow(normalized, exponent);

    const [baseR, baseG, baseB] = pollenMeta[pollenType].baseColor;

    const lightR = Math.round(baseR + (255 - baseR) * 0.7);
    const lightG = Math.round(baseG + (255 - baseG) * 0.7);
    const lightB = Math.round(baseB + (255 - baseB) * 0.7);

    const finalR = Math.round(lightR + (baseR - lightR) * intensity);
    const finalG = Math.round(lightG + (baseG - lightG) * intensity);
    const finalB = Math.round(lightB + (baseB - lightB) * intensity);

    return `rgb(${finalR}, ${finalG}, ${finalB})`;
};

const pollenMeta: Record<
    PollenTypes,
    { name: string; baseColor: [number, number, number] }
> = {
    birch_pollen: {
        name: '🌳 Berk 🟥',
        baseColor: [255, 0, 0],
    },
    alder_pollen: {
        name: '🌲 Els 🟧',
        baseColor: [255, 165, 0],
    },
    grass_pollen: {
        name: '🌿 Gras 🟩',
        baseColor: [0, 128, 0],
    },
    mugwort_pollen: {
        name: '🌾 Bijvoet 🟦',
        baseColor: [0, 0, 255],
    },
    olive_pollen: {
        name: '🫒 Olijf 🟪',
        baseColor: [128, 0, 128],
    },
    ragweed_pollen: {
        name: '🌼 Ambrosia 🟨',
        baseColor: [255, 255, 0],
    },
};

type PollenTypes =
    | 'birch_pollen'
    | 'grass_pollen'
    | 'alder_pollen'
    | 'mugwort_pollen'
    | 'olive_pollen'
    | 'ragweed_pollen';

export const PollenMap = () => {
    const { data } = useFetchPollenMap();
    const [currentTime, setCurrentTime] = useState(0);
    const [selectedPollenType, setSelectedPollenType] =
        useState<PollenTypes>('birch_pollen');
    const [polygonCoordinates, setPolygonCoordinates] = useState<Record<
        string,
        {
            coordinates: LatLngExpression[];
            color: string;
            id: string;
        }[]
    > | null>(null);

    const center: LatLngExpression = [52.1, 5.1];
    const throttledTime = useThrottle(currentTime, 200);

    const asyncProcessDataForType = (pollenType: PollenTypes) => {
        if (!data) return [];

        const coordinatesWithColors = data.map(({ location, hourly }) => {
            const { coordinates } = location;
            const pollenValue = hourly?.[pollenType]?.[currentTime] ?? null;
            const color = getColor(pollenValue, pollenType);

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
        const processData = async () => {
            const processedData = asyncProcessDataForType(selectedPollenType);
            setPolygonCoordinates({
                [selectedPollenType]: processedData,
            });
        };

        processData();
    }, [data, selectedPollenType, throttledTime]);

    const onLayerSwitch = (name: string) => {
        const index = Object.values(pollenMeta).findIndex(
            (val) => val.name == name
        );

        const pollenType = Object.keys(pollenMeta)[index];
        setSelectedPollenType(pollenType as PollenTypes);
    };

    return (
        <div className="map-container2">
            <MapContainer
                center={center}
                zoom={7}
                style={{ height: '75vh', width: '100%', fontSize: '1.2rem' }}
                scrollWheelZoom={true}
            >
                <LayerSwitch onLayerSwitch={onLayerSwitch} />
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LayersControl>
                    {Object.entries(pollenMeta).map(
                        ([pollenType, { name }]) => (
                            <LayersControl.BaseLayer
                                key={pollenType}
                                name={name}
                                checked={selectedPollenType === pollenType}
                            >
                                <LayerGroup>
                                    {/* Render polygons only for the selected pollen type */}
                                    {polygonCoordinates &&
                                        polygonCoordinates[
                                            pollenType as PollenTypes
                                        ]?.map((polygon) => (
                                            <Polygon
                                                key={polygon.id}
                                                positions={polygon.coordinates}
                                                pathOptions={{
                                                    color: polygon.color,
                                                }}
                                                stroke={false}
                                                fillOpacity={0.8}
                                            />
                                        ))}
                                </LayerGroup>
                            </LayersControl.BaseLayer>
                        )
                    )}
                </LayersControl>
            </MapContainer>

            {data && (
                <TimeSlider
                    times={data[0].hourly.time}
                    onTimeChange={(timeIndex) => setCurrentTime(timeIndex)}
                />
            )}
        </div>
    );
};

type LayerSwitchProps = {
    onLayerSwitch: (name: string) => void;
};

const LayerSwitch = ({ onLayerSwitch }: LayerSwitchProps) => {
    useMapEvents({
        baselayerchange: (e) => {
            console.log('Base layer', e);
            onLayerSwitch(e.name);
        },
    });
    return null;
};
