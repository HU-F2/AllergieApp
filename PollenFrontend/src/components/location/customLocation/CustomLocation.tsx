import { useLocationContext } from '../../../contexts/LocationContext';
import {
    LocationData,
    useFetchLocationsList,
} from '../../../services/locationService';
import LocationSearch from './LocationSearch';

const CustomLocation = () => {
    const { permission, resetPermission, setCustomLocation } =
        useLocationContext();
    const { data } = useFetchLocationsList();

    const handleSelect = (location: LocationData) => {
        setCustomLocation(location);
    };

    const handleAskPermission = () => {
        resetPermission();
    };

    if (permission === 'denied') {
        return (
            <div className='location-input-container'>
                <LocationSearch
                    locations={data ?? []}
                    onSelectLocation={handleSelect}
                />

                <div>
                    <button onClick={handleAskPermission}>
                        Wijzig locatie toestemming
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='location-input-container'>
            <LocationSearch
                locations={data ?? []}
                onSelectLocation={handleSelect}
            />

            <div>
                <button onClick={handleAskPermission}>
                    Wijzig locatie toestemming
                </button>
            </div>
        </div>
    );
};

export default CustomLocation;
