import { createContext, ReactNode, useContext, useState } from 'react';
import LocationPermissionModal from '../components/location/locationPermission/LocationPermissionModal';
import { LocationData, useLocation } from '../services/locationService';

export type LocationPermissionType = 'granted' | 'denied' | 'prompt';

type LocationContextType = {
    permission: LocationPermissionType;
    resetPermission: () => void;
    location: LocationData | undefined;
    isLoading: boolean;
    isError: boolean;
    handleAllow: () => void;
    handleDeny: () => void;
    setCustomLocation: (location: LocationData) => void;
    customLocation: LocationData | undefined;
};

const LocationContext = createContext<LocationContextType | null>(null);

type Props = {
    children: ReactNode;
};

export const LocationProvider = ({ children }: Props) => {
    const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>(
        () => (sessionStorage.getItem('locationPermission') as | 'granted' | 'denied') || 'prompt'
    );

    const [customLocation, setCustomLocation] = useState<
        LocationData | undefined
    >(undefined);

    const {
        data: location,
        isLoading,
        isError,
    } = useLocation({
        enabled: permission === 'granted'
    });

    const handleAllow = () => {
        sessionStorage.setItem('locationPermission', 'granted');
        setPermission('granted');
    };

    const handleDeny = () => {
        sessionStorage.setItem('locationPermission', 'denied');
        setPermission('denied');
    };

    const handleResetPermission = () => {
        sessionStorage.removeItem('locationPermission');
        setPermission('prompt');
        setCustomLocation(undefined);
    };

    // Custom location overrides the ip location
    const locationToUse = customLocation || location;

    return (
        <LocationContext.Provider
            value={{
                permission,
                resetPermission: handleResetPermission,
                location: locationToUse,
                isLoading,
                isError,
                handleAllow,
                handleDeny,
                setCustomLocation,
                customLocation,
            }}
        >
            <LocationPermissionModal
                permission={permission}
                onAccept={() => handleAllow()}
                onDeny={() => handleDeny()}
            />
            {children}
        </LocationContext.Provider>
    );
};

export const useLocationContext = (): LocationContextType => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error(
            'useLocationContext must be used within a LocationProvider'
        );
    }
    return context;
};
