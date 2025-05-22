import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import {
    LayerGroup,
    LayersControl,
    MapContainer,
    Marker,
    Polygon,
    TileLayer,
    useMap,
    useMapEvents,
} from 'react-leaflet';
import { useLocationContext } from '../contexts/LocationContext';
import { useFetchPollenMap } from '../services/pollenService';
import { TimeSlider } from './TimeSlider';
import { useCurrentTime } from './hooks/useCurrentTime';
import { useProfilePollenTypes } from './hooks/useProfilePollenTypes';
import { useThrottle } from './hooks/useThrottle';
import { PollenLegend } from './PollenLegend';
import { useSelectedPollenContext } from '../contexts/SelectedPollenContext';

const getColor = (
    pollen: number | null | undefined,
    pollenType: PollenTypes,
    max: number = 30
): string => {
    if (pollen == null) return 'rgb(240,240,240)';

    const baseColor = pollenMeta[pollenType].baseColor;
    const clampedPollen = Math.max(0, Math.min(max, pollen));
    const t = Math.pow(clampedPollen / max, 0.3);

    const startColor: [number, number, number] = [240, 240, 240];
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
    const [profilePollenTypes] = useProfilePollenTypes();
    const {selectedPollenType, setSelectedPollenType} = useSelectedPollenContext();
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
        // Set the first item in profilePollenTypes as selected base layer
        if (profilePollenTypes.length > 0) {
            onLayerSwitch(profilePollenTypes[0]);
        }
    }, [profilePollenTypes]);

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

    const onLayerSwitch = (name: string) => {
        const index = Object.values(pollenMeta).findIndex(
            (val) => val.name == name || val.rawName == name
        );

        const pollenType = Object.keys(pollenMeta)[index];
        setSelectedPollenType(pollenType as PollenTypes);
    };

    return (
        <div className="map-container2">
            <MapContainer
                center={center}
                zoom={11}
                style={{ height: '64vh', width: '100%', fontSize: '1.2rem' }}
                scrollWheelZoom={true}
            >
                <RecenterMap center={center} />
                <LayerSwitch onLayerSwitch={onLayerSwitch} />
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    position={center}
                    title="Uw (geschatte) locatie"
                    icon={customDivIcon}
                />
                <LayersControl ref={controlRef}>
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
                <PollenLegend pollenType={selectedPollenType} />
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

type LayerSwitchProps = {
    onLayerSwitch: (name: string) => void;
};

const LayerSwitch = ({ onLayerSwitch }: LayerSwitchProps) => {
    useMapEvents({
        baselayerchange: (e) => {
            onLayerSwitch(e.name);
        },
    });
    return null;
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
