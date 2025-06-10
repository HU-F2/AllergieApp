import { useEffect } from 'react';
import { useSelectedPollenContext } from '../contexts/SelectedPollenContext';
import { useProfilePollenTypes } from './hooks/useProfilePollenTypes';
import { pollenMeta, PollenTypes } from './PollenMap';

const PollenLayerSelector = () => {
    const [profilePollenTypes] = useProfilePollenTypes();
    const { selectedPollenType, setSelectedPollenType } = useSelectedPollenContext();

    const onLayerSwitch = (name: string) => {
        const index = Object.values(pollenMeta).findIndex(
            (val) => val.name == name || val.rawName == name
        );

        const pollenType = Object.keys(pollenMeta)[index];
        setSelectedPollenType(pollenType as PollenTypes);
    };

    useEffect(() => {
        if (profilePollenTypes.length > 0) {
            onLayerSwitch(profilePollenTypes[0]);
        }
    }, [profilePollenTypes]);

    return (
        <div className="pollen-layer-selector">
            <strong>Choose Pollen Type</strong>
            {Object.entries(pollenMeta).map(([pollenType, { name }]) => (
                <div key={pollenType}>
                    <label>
                        <input
                            type="radio"
                            name="pollenLayer"
                            value={pollenType}
                            checked={selectedPollenType === pollenType}
                            onChange={() => onLayerSwitch(name)}
                        />
                        {name}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default PollenLayerSelector;
