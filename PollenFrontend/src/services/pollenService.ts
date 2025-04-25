import { useQuery } from '@tanstack/react-query';

export interface PollenData {
    latitude: number;
    longitude: number;
    hourly_units: {
        time: string;
        birch_pollen: string;
        grass_pollen: string;
    };
    hourly: {
        time: string[];
        birch_pollen: (number | null)[];
        grass_pollen: (number | null)[];
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
    const response = await fetch('http://localhost:5000/api/pollen/map');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const useFetchPollenMap = () =>
    useQuery({
        queryKey: ['pollen'],
        queryFn: fetchPollenMap,
        retry: false,
        staleTime: Infinity,
    });
