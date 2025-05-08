import { useLocationContext } from '../../../contexts/LocationContext';
import { LocationData, useFetchLocationsList } from '../../../services/locationService';
import LocationSearch from './LocationSearch';
import LocationPermissionReset from './LocationPermissionReset';

const CustomLocation = () => {
    const { resetPermission, setCustomLocation } = useLocationContext();
    const { data } = useFetchLocationsList();

    const handleSelect = (location: LocationData) => {
        setCustomLocation(location);
    };

    const handleAskPermission = () => {
        resetPermission();
    };

    return (
        <div className='location-input-container'>
            <LocationSearch
                locations={data ?? []}
                onSelectLocation={handleSelect}
            />
            <LocationPermissionReset onClick={handleAskPermission} />
        </div>
    );
};

export default CustomLocation;