import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { QUERY_KEYS } from './queryKeys';
import { Coordinate } from './pollenService';
import { PollenType, validPollenTypes } from './pollenTypeMapping';
import { convertToMilliseconds, toDateOnlyString } from '../utils/dateFunctions';

export interface PollenDataRequest {
    date: Date;
    coordinate: Coordinate;
}

export interface AllergySuggestion {
    pollenType: PollenType;
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
        const invalidRequest = requests.find(req =>
            !req.coordinate.latitude || !req.coordinate.longitude
        );

        if (invalidRequest) {
            throw new Error('Latitude of Longitude ontbreekt in één van de requests');
        }
        
        const response = await axios.post<AnalysisResponse>(
            `${import.meta.env.VITE_BACKEND_API_URL}/api/AllergySuggestion/analyze`,
            requests.map(req => ({
                Date: toDateOnlyString(req.date),
                Latitude: req.coordinate.latitude.toLocaleString('en-US'),
                Longitude: req.coordinate.longitude.toLocaleString('en-US'),
            }))
        );

        const invalid = response.data.suggestions.find(
            (sug) => !validPollenTypes.includes(sug.pollenType)
        );

        if (invalid) {
            throw new Error(
                `Ongeldig pollenType ontvangen van backend: "${invalid.pollenType}"`
            );
        }

        const castedSuggestions: AllergySuggestion[] = response.data.suggestions.map((sug) => ({
            pollenType: sug.pollenType as PollenType,
            averageConcentration: sug.averageConcentration,
        }));

        return {
            disclaimer: response.data.disclaimer,
            suggestions: castedSuggestions,
        };
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ApiError>;
            const msg = axiosError.response?.data?.message ?? axiosError.message ?? 'Fout bij communicatie met de backend.';

            console.error('Axios fout analyzing symptoms:', msg);
            throw new Error(msg);
        } else if (error instanceof Error) {
            console.error('Logische fout analyzing symptoms:', error.message);
            throw error;
        } else {
            console.error('Onbekende fout analyzing symptoms:', error);
            throw new Error('Er is een onbekende fout opgetreden tijdens analyse.');
        }
    }
};

export const useAnalysisQuery = (requests: PollenDataRequest[], options?: { skip?: boolean }) =>
    useQuery<AnalysisResponse, Error>({
        queryKey: [QUERY_KEYS.pollen.analysis, ...requests.map(r =>
            `${r.date.toISOString()}-${r.coordinate.latitude.toLocaleString('en-US')}-${r.coordinate.longitude.toLocaleString('en-US')}`
        )],
        queryFn: () => analyzeSymptoms(requests),
        retry: 1,
        staleTime: convertToMilliseconds({ hours: 4 }),
        enabled: !options?.skip && requests.length > 0,
    });