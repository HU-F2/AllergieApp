import { useQuery } from '@tanstack/react-query';

async function getLocation() {
    // https://ip-api.com/docs/api:json
    const url = `http://ip-api.com/json/`;

    try {
        const response = await (await fetch(url)).json();

        return {
            latitude: response.lat,
            longitude: response.lon,
            city: response.city,
        };
    } catch (error) {
        console.error('Error fetching location data:', error);
    }
}

export const useLocation = () =>
    useQuery({
        queryKey: ['myLocation'],
        queryFn: getLocation,
    });
