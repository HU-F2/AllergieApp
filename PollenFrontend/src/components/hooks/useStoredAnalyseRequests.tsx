import { useState, useEffect, useCallback } from 'react';
import { useLocationContext } from '../../contexts/LocationContext';
import { PollenDataRequest } from '../../services/symptomsService';

export const useAnalysisRequests = () => {
    const { location } = useLocationContext();
    const [requests, setRequests] = useState<PollenDataRequest[]>([]);

    // Laad opgeslagen requests bij init
    useEffect(() => {
        const storedRequests = localStorage.getItem(import.meta.env.VITE_ALLERGY_ANALYSES_REQUESTS_KEY);
        if (storedRequests) {
            try {
                const parsed = JSON.parse(storedRequests) as PollenDataRequest[];
                setRequests(parsed.map(r => ({
                    ...r,
                    date: new Date(r.date),
                    coordinate: r.coordinate || {
                        latitude: location!.latitude,
                        longitude: location!.longitude
                    }
                })));
            } catch {
                // Negeer corrupte data
            }
        }
    }, [location]);

    // Sla requests op bij wijziging
    useEffect(() => {
        if (requests.length > 0) {
            localStorage.setItem(import.meta.env.VITE_ALLERGY_ANALYSES_REQUESTS_KEY, JSON.stringify(requests));
        } else {
            localStorage.removeItem(import.meta.env.VITE_ALLERGY_ANALYSES_REQUESTS_KEY);
        }
    }, [requests]);

    const updateRequests = useCallback((dates: Date[]) => {
        const newRequests: PollenDataRequest[] = dates.map(date => ({
            date,
            coordinate: {
                latitude: location!.latitude,
                longitude: location!.longitude
            }
        }));
        setRequests(newRequests);
    }, [location]);

    const clearRequests = useCallback(() => {
        setRequests([]);
    }, []);

    return {
        requests,
        updateRequests,
        clearRequests,
        hasRequests: requests.length > 0
    };
};