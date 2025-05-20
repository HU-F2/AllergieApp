import { LocationData } from '../services/locationService';
import { formatDutchDate } from '../utils/utilityFunctions';
import SelectablePollenIndicator from './SelectablePollenIndicator';

type Props = {
    location: LocationData | undefined;
};

const PollenInfo = ({ location }: Props) => {
    const formattedDate = formatDutchDate(new Date());

    if (location == undefined) {
        return (
            <div className="no-location-selected">
                <p>Selecteer een locatie om pollen informatie te bekijken.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="pollen-summary">
                <h1>Pollen in {location?.name}:</h1>
                <SelectablePollenIndicator location={location} />
                <p className="date-text">{formattedDate}</p>
            </div>
        </div>
    );
};

export default PollenInfo;
