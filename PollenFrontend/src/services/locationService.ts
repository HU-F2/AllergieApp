import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';
import { isElectron } from '../utils/utilityFunctions';

export type LocationData = {
    latitude: number;
    longitude: number;
    name: string;
};

const getElectronLocation = async (): Promise<LocationData | undefined> => {
    try {
        // https://ip-api.com/docs/api:json
        const url = `${import.meta.env.VITE_IP_API_URL}`;

        const response = await (await fetch(url)).json();

        return {
            latitude: response.lat,
            longitude: response.lon,
            name: response.city,
        };
    } catch (error) {
        console.error('Error fetching location data:', error);
    }
};

const getWebLocation = async (): Promise<LocationData> => {
    if (!navigator.geolocation) {
        throw new Error('Geolocatie wordt niet ondersteund in deze browser.');
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const latitude = pos.coords.latitude;
                const longitude = pos.coords.longitude;

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();
                    const name = data.address.city || data.address.town || data.address.village || 'huidige locatie';

                    resolve({ latitude, longitude, name });
                } catch (error) {
                    console.error('Fout bij reverse geocoding:', error);
                    resolve({ latitude, longitude, name: 'Onbekend' });
                }
            },
            (err) => {
                console.error('Fout bij ophalen van geolocatie:', err);
                reject(new Error('Toegang tot locatie geweigerd.'));
            }
        );
    });
};

// Kiest juiste helper
const getLocation = async (): Promise<LocationData | undefined> => {
    return isElectron() ? await getElectronLocation() : await getWebLocation();
};

export const useLocation = (options?: { enabled: boolean }) =>
    useQuery<LocationData | undefined>({
        queryKey: QUERY_KEYS.location.me,
        queryFn: getLocation,
        ...options,
    });

const fetchLocationsList = async (): Promise<LocationData[]> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/locations/list`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const useFetchLocationsList = () =>
    useQuery({
        queryKey: QUERY_KEYS.location.list,
        queryFn: fetchLocationsList,
    });
