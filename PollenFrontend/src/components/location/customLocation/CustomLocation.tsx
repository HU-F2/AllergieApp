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
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                }}
            >
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
        <LocationSearch
            locations={data ?? []}
            onSelectLocation={handleSelect}
        />
    );
};

export default CustomLocation;
