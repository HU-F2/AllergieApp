import { useEffect, useState } from 'react';
import { DateObject } from 'react-multi-date-picker';
import { getValidDates } from '../../utils/dateFunctions';

export const useStoredDates = (
    minDate: Date,
    maxDate: Date,
    onInvalidateResults?: () => void // Callback voor results reset
): [Date[], (dates: (Date | DateObject)[]) => void] => {
    const [dates, setDatesState] = useState<Date[]>([]);

    // Laad bij init
    useEffect(() => {
        const stored = localStorage.getItem(import.meta.env.VITE_ALLERGY_ANALYSES_DATES_KEY);
        if (stored) {
            try {
                const parsed: Date[] = JSON.parse(stored).map((d: string) => new Date(d));
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
        localStorage.setItem(import.meta.env.VITE_ALLERGY_ANALYSES_DATES_KEY, JSON.stringify(valid));

        // Resultaat wordt ongeldig
        localStorage.removeItem(import.meta.env.VITE_ALLERGY_ANALYSES_REQUESTS_KEY);
        localStorage.removeItem(import.meta.env.VITE_ANALYSIS_RESULT_KEY);

        onInvalidateResults?.();
    };

    return [dates, setDates];
};