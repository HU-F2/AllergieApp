import { useEffect, useState } from 'react';
import { LocationData } from '../services/locationService';
import { useFetchPollenByLocation } from '../services/pollenService';
import Alert from './Alert';
import PollenIndicator from './PollenIndicator';
import { formatDutchDate } from '../utils/utilityFunctions';

type Props = {
    location: LocationData | undefined;
};

const PollenInfo = ({ location }: Props) => {
    const { data: pollenData, refetch } = useFetchPollenByLocation(location);

    useEffect(() => {
        if (location) {
            refetch();
        }
    }, [location, refetch]);

    const [alert, setAlert] = useState<string | undefined>(undefined);

    const totalPollen = Object.values(PollenType).reduce((sum, type) => {
        const count = pollenData?.hourly[type as PollenType]?.[0] ?? 0;
        return sum + count;
    }, 0);

    const formattedDate = formatDutchDate(new Date('2023-12-25'));

    if (location == undefined) {
        return (
            <div className="no-location-selected">
                <p>Selecteer een locatie om pollen informatie te bekijken.</p>
            </div>
        );
    }

    return (
        <div>
            {alert && (
                <Alert
                    message={alert}
                    type="error"
                    autoRemoveTime={5000}
                    onClose={() => setAlert(undefined)}
                />
            )}

            <div className='pollen-summary'>
                <h1>Pollen in {location?.name}:</h1>
                <PollenIndicator
                    max={Object.values(pollenMetadata).reduce(
                        (sum, meta) => sum + meta.max,
                        0
                    )}
                    min={Object.values(pollenMetadata).reduce(
                        (sum, meta) => sum + meta.min,
                        0
                    )}
                    value={totalPollen}
                    name="Totale pollen"
                    onDangerLevelReached={() =>
                        setAlert(
                            'De pollen zijn momenteel zeer hoog. \nHet is verstandig om binnen te blijven.'
                        )
                    }
                />
                <p className='date-text'>{formattedDate}</p>
                <h2>Specifieke pollen</h2>
            </div>
            <div className="pollen-indicators-container">
                {Object.values(PollenType).map((type) => {
                    const count =
                        pollenData?.hourly[type as PollenType]?.[0] ?? null;
                    const pollenDataPoint = pollenMetadata[type as PollenType];
                    return (
                        <PollenIndicator
                            key={pollenDataPoint.label}
                            max={pollenDataPoint.max}
                            min={pollenDataPoint.min}
                            value={count ?? 0}
                            name={pollenDataPoint.label}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default PollenInfo;

export enum PollenType {
    Birch = 'birch_pollen',
    Grass = 'grass_pollen',
    Alder = 'alder_pollen',
    Mugwort = 'mugwort_pollen',
    Olive = 'olive_pollen',
    Ragweed = 'ragweed_pollen',
}

const pollenMetadata: Record<
    PollenType,
    { label: string; min: number; max: number }
> = {
    [PollenType.Birch]: { label: 'Berkpollen', min: 0, max: 12 },
    [PollenType.Grass]: { label: 'Graspollen', min: 0, max: 20 },
    [PollenType.Alder]: { label: 'Elzenpollen', min: 0, max: 10 },
    [PollenType.Mugwort]: { label: 'Absintpollen', min: 0, max: 8 },
    [PollenType.Olive]: { label: 'Olijfpollen', min: 0, max: 15 },
    [PollenType.Ragweed]: { label: 'Ambrosiapollen', min: 0, max: 18 },
};
