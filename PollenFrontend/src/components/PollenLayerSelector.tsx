import { useSelectedPollenContext } from '../contexts/SelectedPollenContext';
import { pollenMeta, PollenTypes } from './PollenMap';

const PollenLayerSelector = () => {
    const { selectedPollenType, setSelectedPollenType } =
        useSelectedPollenContext();

    const onLayerSwitch = (name: string) => {
        setSelectedPollenType(name as PollenTypes);
    };

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
                            onChange={() => onLayerSwitch(pollenType)}
                        />
                        {name}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default PollenLayerSelector;
