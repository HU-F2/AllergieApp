import { useState } from 'react';
import { LocationData } from '../services/locationService';
import { useFetchPollenByLocation } from '../services/pollenService';
import Alert from './Alert';
import PollenIndicator from './PollenIndicator';

type Props = {
    location: LocationData | undefined;
};

const PollenInfo = ({ location }: Props) => {
    const { data: pollenData } = useFetchPollenByLocation(location);
    const [alert, setAlert] = useState<string | undefined>(undefined);

    const totalPollen = Object.values(PollenType).reduce((sum, type) => {
        const count = pollenData?.hourly[type as PollenType]?.[0] ?? 0;
        return sum + count;
    }, 0);

    const dateFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    } satisfies Intl.DateTimeFormatOptions;
    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat(
        'nl-NL',
        dateFormatOptions
    ).format(date);

    if (location == undefined) {
        return <p>Selecteer een locatie om pollen informatie te bekijken.</p>;
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

            <h1 style={{ textAlign: 'center' }}>Pollen in {location?.name}:</h1>
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
            <p
                style={{
                    textAlign: 'center',
                    textTransform: 'capitalize',
                    fontSize: '1.2rem',
                    fontStyle: 'italic',
                }}
            >
                {formattedDate}
            </p>
            <h2 style={{ textAlign: 'center' }}>Specifieke pollen</h2>
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
