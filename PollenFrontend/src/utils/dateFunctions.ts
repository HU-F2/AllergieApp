import { DateObject } from "react-multi-date-picker";
import { useEffect, useState } from 'react';

/**
 * Converteert een datumstring naar een geformatteerde Nederlandse datum (bijv. "15 januari")
 * @param {string} dateStr - Datumstring in een door Date.parse() herkenbaar formaat (bijv. YYYY-MM-DD)
 * @returns {string} Geformatteerde datum in Nederlands formaat (dag + maand)
 * @throws {Error} Als de invoerstring geen geldige datum is
 * @example
 * // Returns "15 januari"
 * formatDate("2023-01-15");
 *
 * // Throws an error
 * formatDate("ongeldige-datum");
 */
export const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
        throw new Error(`Ongeldige datumstring: ${dateStr}`);
    }

    return date.toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
    });
};

/**
 * Formatteert een datum naar Nederlands lang formaat (bijv. "maandag 15 januari")
 * @param date - Optionele Date object (standaard: huidige datum)
 * @returns Geformatteerde datumstring
 */
export const formatDutchDate = (date: Date = new Date()): string => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    };

    return new Intl.DateTimeFormat('nl-NL', options).format(date);
};

/**
 * Converteert een Date object naar een YYYY-MM-DD string
 * zonder tijdzone informatie om tijdsverschillen te voorkomen
 */
export const toDateOnlyString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Converteert tijdseenheden naar milliseconden
 * @param {Object} options - Conversie opties
 * @param {number} [options.seconds=0] - Aantal seconden
 * @param {number} [options.minutes=0] - Aantal minuten
 * @param {number} [options.hours=0] - Aantal uren
 * @returns {number} Totaal aantal milliseconden
 * @example
 * // Returns 3661000 (1 uur + 1 minuut + 1 seconde)
 * convertToMilliseconds({ hours: 1, minutes: 1, seconds: 1 })
 *
 * // Returns 60000 (1 minuut)
 * convertToMilliseconds({ minutes: 1 })
 */
export const convertToMilliseconds = ({
  seconds = 0,
  minutes = 0,
  hours = 0
}: {
  seconds?: number;
  minutes?: number;
  hours?: number;
}): number => {
  return (
    hours * 60 * 60 * 1000 +  // uren naar ms
    minutes * 60 * 1000 +      // minuten naar ms
    seconds * 1000             // seconden naar ms
  );
};

/*
 * @example
 * // Voorbeeldgebruik:
 * const twoMonthsAgo = getTwoMonthsAgo();
 * console.log(twoMonthsAgo.toLocaleDateString()); // "22/05/2023" (als vandaag 22/07/2023 is)
 *
 * @returns {Date} Een nieuwe Date instantie die twee maanden voor de huidige datum ligt.
 *                Bij overgang naar een maand met minder dagen (bijv. 31 → 30/29/28),
 *                wordt de laatste dag van de doelmaand gebruikt.
 *
 * @throws {Error} Wordt alleen gegenereerd als de Date object manipulatie onverwacht faalt
 *                 (zeer zeldzaam in normale omstandigheden).
 *
 * @since 1.0.0
 * @author [Jouw Naam]
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date|MDN Date Documentation}
 * voor meer informatie over Date object manipulatie.
 */
export const getTwoMonthsAgo = (): Date => {
    const now = new Date();
    const twoMonthsAgo = new Date(now);
    twoMonthsAgo.setMonth(now.getMonth() - 2);

    // Correctie voor maanden met verschillende lengtes
    // Als de dag van de maand niet bestaat in de nieuwe maand (bijv. 31 -> 30)
    if (twoMonthsAgo.getDate() !== now.getDate()) {
        twoMonthsAgo.setDate(0); // Zet naar laatste dag van vorige maand
    }

    return twoMonthsAgo;
}

/**
 * Genereert een unieke sleutel voor een specifieke dag in het formaat 'YYYY-MM-DD'.
 *
 * @param date - De datum waarvan je de sleutel wilt genereren.
 * @returns De dag-sleutel in ISO-formaat 'YYYY-MM-DD'.
 */
export const getDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

/**
 * Checks if a date is valid (not null/undefined and not "Invalid Date")
 * @param {Date | null | undefined} date - Date to validate
 * @returns {boolean} True if the date is valid
 */
export const isValidDate = (date: Date | null | undefined): date is Date => {
    return !!date && !isNaN(date.getTime());
};

/**
 * Truncates time information from a date (sets hours/min/sec/ms to 0)
 * Useful for day-only comparisons to avoid timezone issues.
 * @param {Date} date - Input date
 * @returns {Date} New date with time reset to 00:00:00
 */
export const truncateTime = (date: Date): Date => {
    return new Date(date.setHours(0, 0, 0, 0));
};

/**
 * Validates and normalizes min/max date boundaries.
 * Returns undefined for invalid inputs.
 * @param {Date | undefined} date - Boundary date to check
 * @returns {Date | undefined} Valid date or undefined
 */
export const validateBoundaryDate = (date: Date | undefined): Date | undefined => {
    return isValidDate(date) ? truncateTime(new Date(date)) : undefined;
};

/**
 * Processes an array of dates/DateObjects into valid, filtered dates.
 * @param {Array<Date | DateObject>} dates - Input dates
 * @param {Object} [options] - Configuration
 * @param {Date} [options.minDate] - Min allowed date (inclusive)
 * @param {Date} [options.maxDate] - Max allowed date (inclusive)
 * @param {boolean} [options.filterDuplicates=true] - Remove duplicates
 * @param {boolean} [options.truncateTime=true] - Ignore time components
 * @returns {Date[]} Valid, sorted dates
 */
export const getValidDates = (
    dates: (Date | DateObject)[],
    options?: {
        minDate?: Date;
        maxDate?: Date;
        filterDuplicates?: boolean;
        truncateTime?: boolean;
    }
): Date[] => {
    // Destructure with defaults
    const {
        minDate,
        maxDate,
        filterDuplicates = true,
        truncateTime: shouldTruncate = true
    } = options || {};

    // Validate boundaries
    const safeMinDate = validateBoundaryDate(minDate);
    const safeMaxDate = validateBoundaryDate(maxDate);

    // Convert and filter dates
    let processedDates = dates
        .map(date => {
            if (date instanceof Date) return date;
            try {
                return date?.toDate?.();
            } catch {
                return undefined;
            }
        })
        .filter(isValidDate)
        .map(date => shouldTruncate ? truncateTime(new Date(date)) : new Date(date));

    // Apply date bounds
    if (safeMinDate || safeMaxDate) {
        processedDates = processedDates.filter(date => {
            const time = date.getTime();
            return (
                (!safeMinDate || time >= safeMinDate.getTime()) &&
                (!safeMaxDate || time <= safeMaxDate.getTime())
            );
        });
    }

    // Deduplicate
    if (filterDuplicates) {
        processedDates = [...new Set(processedDates.map(date => date.getTime()))]
            .map(time => new Date(time));
    }

    // Sort oldest to newest
    return processedDates.sort((a, b) => a.getTime() - b.getTime());
};

/**
 * Custom React hook die een stabiele 'dag'-key teruggeeft (YYYY-MM-DD).
 * Deze wordt automatisch geüpdatet net na middernacht.
 *
 * @returns De huidige dag als string in 'YYYY-MM-DD'-formaat.
 */
export const useDayKey = (): string => {
    const [dayKey, setDayKey] = useState(() => getDateKey(new Date()));

    useEffect(() => {
        const now = new Date();
        const nextMidnight = new Date(now);
        nextMidnight.setHours(24, 0, 1, 0); // 00:00:01 volgende dag

        const timeout = nextMidnight.getTime() - now.getTime();

        const timer = setTimeout(() => {
            setDayKey(getDateKey(new Date()));
        }, timeout);

        return () => clearTimeout(timer);
    }, [dayKey]);

    return dayKey;
};