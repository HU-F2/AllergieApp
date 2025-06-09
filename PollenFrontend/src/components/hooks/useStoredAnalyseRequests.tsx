import { useState, useEffect, useCallback } from 'react';
import { useLocationContext } from '../../contexts/LocationContext';
import { PollenDataRequest } from '../../services/symptomsService';
import { decryptData, encryptData } from '../../utils/encryptionUtils';

export const useAnalysisRequests = () => {
    const { location } = useLocationContext();
    const [requests, setRequests] = useState<PollenDataRequest[]>([]);

    // Laad opgeslagen requests bij init
    useEffect(() => {
        const storedRequests = decryptData(localStorage.getItem(import.meta.env.VITE_ALLERGY_ANALYSES_REQUESTS_KEY));
        if (storedRequests) {
            try {
                const parsed = storedRequests as PollenDataRequest[];
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
            localStorage.setItem(import.meta.env.VITE_ALLERGY_ANALYSES_REQUESTS_KEY, encryptData(requests));
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