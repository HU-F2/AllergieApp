import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';

export type LocationData = {
    latitude: number;
    longitude: number;
    name: string;
};

const getLocation = async (): Promise<LocationData | undefined> => {
    // https://ip-api.com/docs/api:json
    const url = `${import.meta.env.VITE_IP_API_URL}`;

    try {
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
