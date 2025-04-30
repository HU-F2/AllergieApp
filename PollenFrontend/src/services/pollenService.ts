import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';

export interface PollenData {
    latitude: number;
    longitude: number;
    hourly_units: {
        time: string;
        birch_pollen: string;
        grass_pollen: string;
        alder_pollen: string;
        mugwort_pollen: string;
        olive_pollen: string;
        ragweed_pollen: string;
    };
    hourly: {
        time: string[];
        birch_pollen: (number | null)[] | null;
        grass_pollen: (number | null)[] | null;
        alder_pollen: (number | null)[] | null;
        mugwort_pollen: (number | null)[] | null;
        olive_pollen: (number | null)[] | null;
        ragweed_pollen: (number | null)[] | null;
    };
    location: Location;
}

export type Coordinate = {
    latitude: number;
    longitude: number;
};

export type Location = {
    id: string; // UUID
    name: string;
    latitude: number;
    longitude: number;
    coordinates: Coordinate[];
};

const fetchPollenMap = async (): Promise<PollenData[]> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/pollen/map`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const useFetchPollenMap = () =>
    useQuery({
        queryKey: QUERY_KEYS.pollen.map,
        queryFn: fetchPollenMap,
        retry: false,
        staleTime: Infinity,
    });

const fetchPollenByLocation = async (
    latitude: number,
    longitude: number
): Promise<PollenData> => {
    const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/pollen/location?latitude=${latitude}&longitude=${longitude}`
    );
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const useFetchPollenByLocation = (coordinate?: Coordinate) =>
    useQuery({
        queryKey: QUERY_KEYS.pollen.location(coordinate),
        queryFn: () => {
            if (!coordinate) {
                return Promise.reject('No coordinate provided');
            }
            return fetchPollenByLocation(
                coordinate.latitude,
                coordinate.longitude
            );
        },
        enabled: Boolean(coordinate),
        retry: false,
    });
