import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { QUERY_KEYS } from './queryKeys';
import { Coordinate } from './pollenService';

export interface PollenDataRequest {
    date: Date;
    coordinate: Coordinate;
}

export interface AllergySuggestion {
    pollenType: string;
    averageConcentration: number;
}

export interface AnalysisResponse {
    disclaimer: string;
    suggestions: AllergySuggestion[];
}

export interface ApiError {
    message: string;
}

export const analyzeSymptoms = async (requests: PollenDataRequest[]): Promise<AnalysisResponse> => {
    try {
        const response = await axios.post<AnalysisResponse>(
            `${import.meta.env.VITE_BACKEND_API_URL}/api/AllergySuggestion/analyze`,
            requests.map(req => ({
                Date: req.date,
                Latitude: req.coordinate.latitude,
                Longitude: req.coordinate.longitude,
            }))
        );

        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        console.error('Error analyzing symptoms:', axiosError.message);
        throw new Error(
            axiosError.response?.data?.message || 'Failed to analyze symptoms'
        );
    }
};

export const useAnalysisQuery = (requests: PollenDataRequest[]) =>
    useQuery<AnalysisResponse, Error>({
        queryKey: [QUERY_KEYS.pollen.analysis, ...requests.map(r =>
            `${r.date.toISOString()}-${r.coordinate.latitude}-${r.coordinate.longitude}`
        )],
        queryFn: () => analyzeSymptoms(requests),
        retry: 1,
        staleTime: 1000 * 60 * 60 * 4, // 4 uur
        enabled: requests.length > 0,
    });