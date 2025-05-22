import { useProfilePollenTypes } from '../../hooks/useProfilePollenTypes';
import { pollenMeta } from '../../PollenMap';
import Selector from './Selector';

const PollenSelector = () => {
    const [pollenTypes, setPollenTypes] = useProfilePollenTypes();

    return (
        <Selector
            options={Object.values(pollenMeta).map((pollen) => pollen.rawName)}
            selected={pollenTypes}
            onChange={setPollenTypes}
        />
    );
};

export default PollenSelector;
