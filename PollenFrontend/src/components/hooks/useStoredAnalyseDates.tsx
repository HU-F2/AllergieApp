import { useEffect, useState } from 'react';
import { DateObject } from 'react-multi-date-picker';
import { getValidDates } from '../../utils/dateFunctions';
import { decryptData, encryptData } from '../../utils/encryptionUtils';

export const useStoredDates = (
    minDate: Date,
    maxDate: Date,
    onInvalidateResults?: () => void // Callback voor results reset
): [Date[], (dates: (Date | DateObject)[]) => void, () => void] => {
    const [dates, setDatesState] = useState<Date[]>([]);

    // Laad bij init
    useEffect(() => {
        const stored: any = decryptData(localStorage.getItem(import.meta.env.VITE_ALLERGY_ANALYSES_DATES_KEY));
        if (stored) {
            try {
                const parsed: Date[] = stored.map((d: string) => new Date(d));
                const valid = getValidDates(parsed, { minDate, maxDate, filterDuplicates: true, truncateTime: true });
                setDatesState(valid);
            } catch {
                setDatesState([]);
            }
        }
    }, [minDate, maxDate]);

    const setDates = (rawDates: (Date | DateObject)[]) => {
        const valid = getValidDates(rawDates, {
            minDate,
            maxDate,
            filterDuplicates: true,
            truncateTime: true,
        });

        setDatesState(valid);
        localStorage.setItem(import.meta.env.VITE_ALLERGY_ANALYSES_DATES_KEY, encryptData(valid));

        invalidateResults();
    };

    const invalidateResults = () => {
        localStorage.removeItem(import.meta.env.VITE_ALLERGY_ANALYSES_REQUESTS_KEY);
        localStorage.removeItem(import.meta.env.VITE_ANALYSIS_RESULT_KEY);

        onInvalidateResults?.();
    };

    return [dates, setDates, invalidateResults];
};