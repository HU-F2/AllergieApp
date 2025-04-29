import { createContext, ReactNode, useContext, useState } from 'react';
import LocationPermissionModal from '../components/location/locationPermission/LocationPermissionModal';
import { LocationData, useLocation } from '../services/locationService';

export type LocationPermissionType = 'allowed' | 'denied' | null;

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
    const [permission, setPermission] = useState<'allowed' | 'denied' | null>(
        () =>
            (sessionStorage.getItem('locationPermission') as
                | 'allowed'
                | 'denied') || null
    );

    const [customLocation, setCustomLocation] = useState<
        LocationData | undefined
    >(undefined);

    const {
        data: location,
        isLoading,
        isError,
    } = useLocation({ enabled: permission === 'allowed' });

    const handleAllow = () => {
        sessionStorage.setItem('locationPermission', 'allowed');
        setPermission('allowed');
    };

    const handleDeny = () => {
        sessionStorage.setItem('locationPermission', 'denied');
        setPermission('denied');
    };

    const handleResetPermission = () => {
        sessionStorage.removeItem('locationPermission');
        setPermission(null);
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
