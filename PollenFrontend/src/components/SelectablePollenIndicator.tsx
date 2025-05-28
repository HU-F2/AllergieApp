import { useEffect, useMemo, useState } from 'react';
import { useSelectedPollenContext } from '../contexts/SelectedPollenContext';
import { LocationData } from '../services/locationService';
import { useFetchPollenByLocation } from '../services/pollenService';
import PollenIndicator from './PollenIndicator';
import { pollenMeta, PollenTypes } from './PollenMap';

type Props = {
    location: LocationData;
};

const SelectablePollenIndicator = ({ location }: Props) => {
    const { data: pollenData } = useFetchPollenByLocation(location);
    const {
        selectedPollenType: globalSelectedPollenType,
        setSelectedPollenType: globalSetSelectedPollenType,
    } = useSelectedPollenContext();
    const [selectedPollenType, setSelectedPollenType] = useState<
        PollenTypes | 'total'
    >('total');

    const totalPollen = Object.values(PollenTypes).reduce((sum, type) => {
        const count = pollenData?.hourly[type as PollenTypes]?.[0] ?? 0;
        return sum + count;
    }, 0);

    const selectedPollenData = useMemo(() => {
        const isTotal = selectedPollenType === 'total';

        const label = isTotal
            ? 'Totaal'
            : pollenMeta[selectedPollenType].rawName;
        const min = isTotal ? 0 : pollenMeta[selectedPollenType].min;
        const max = isTotal ? 82 : pollenMeta[selectedPollenType].max;
        const value = isTotal
            ? totalPollen
            : (pollenData?.hourly[selectedPollenType]?.[0] ?? 0);

        return {
            label,
            min,
            max,
            value,
        };
    }, [selectedPollenType, pollenMeta, totalPollen, pollenData]);

    useEffect(() => {
        setSelectedPollenType(globalSelectedPollenType);
    }, [globalSelectedPollenType]);

    useEffect(() => {
        if (selectedPollenType != 'total') {
            globalSetSelectedPollenType(selectedPollenType);
        }
    }, [selectedPollenType]);

    return (
        <div className="selectable-pollen-indicator">
            <PollenIndicator
                min={selectedPollenData.min}
                max={selectedPollenData.max}
                name={selectedPollenData.label}
                value={selectedPollenData.value}
            />
            <select
                onChange={(e) =>
                    setSelectedPollenType(
                        e.target.value as PollenTypes | 'total'
                    )
                }
                value={selectedPollenType}
            >
                <option value="total">Totaal</option>
                {Object.values(PollenTypes).map((pollenType) => (
                    <option key={pollenType} value={pollenType}>
                        {pollenMeta[pollenType].rawName}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectablePollenIndicator;
