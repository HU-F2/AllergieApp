import { LocationData } from '../services/locationService';
import { formatDutchDate } from '../utils/utilityFunctions';
import SelectablePollenIndicator from './SelectablePollenIndicator';

type Props = {
    location: LocationData | undefined;
};

const PollenInfo = ({ location }: Props) => {
    const formattedDate = formatDutchDate(new Date());

    if (!location) {
        return (
            <div className="no-location-selected">
                <p>Selecteer een locatie om pollen informatie te bekijken.</p>
            </div>
        );
    }

    return (
        <div className="pollen-summary">
            <SelectablePollenIndicator location={location} />
            <p className="date-text">{formattedDate}</p>
        </div>
    );
};

export default PollenInfo;
