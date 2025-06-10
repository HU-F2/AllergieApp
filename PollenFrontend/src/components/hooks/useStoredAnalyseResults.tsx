import { useEffect, useState } from 'react';
import { AnalysisResponse, PollenDataRequest } from '../../services/symptomsService';
import { decryptData, encryptData } from '../../utils/encryptionUtils';

export const useStoredResults = (requests: PollenDataRequest[]) => {
    const [results, setResults] = useState<AnalysisResponse | null>(null);

    useEffect(() => {
        try {
            if (requests.length === 0) {
                setResults(null);
                return;
            }

            const cached = decryptData(localStorage.getItem(import.meta.env.VITE_ALLERGY_ANALYSES_RESULTS_KEY));
            if (!cached) {
                setResults(null);
                return;
            }

            const parsed = cached as AnalysisResponse;
            const cachedRequests = decryptData(localStorage.getItem(import.meta.env.VITE_ALLERGY_ANALYSES_REQUESTS_KEY));

            if (cachedRequests) {
                const lastRequests = cachedRequests as PollenDataRequest[];
                const requestsMatch = lastRequests.length === requests.length &&
                    lastRequests.every((r, i) =>
                        new Date(r.date).toISOString() === requests[i].date.toISOString() &&
                        r.coordinate.latitude === requests[i].coordinate.latitude &&
                        r.coordinate.longitude === requests[i].coordinate.longitude
                    );

                if (requestsMatch) {
                    setResults(parsed);
                } else {
                    setResults(null);
                }
            }
        } catch {
            setResults(null);
        }
    }, [requests]);

    const saveResults = (res: AnalysisResponse | null) => {
        if (!res) {
            localStorage.setItem(import.meta.env.VITE_ALLERGY_ANALYSES_RESULTS_KEY, encryptData(res));
        }
        setResults(res);
    };

    return [results, saveResults] as const;
};