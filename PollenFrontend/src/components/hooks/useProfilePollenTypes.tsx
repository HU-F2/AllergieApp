import { useEffect, useState } from 'react';

const POLLEN_ALLERGY_KEY = 'selectedPollenTypes';

export const useProfilePollenTypes = (): [
    string[],
    React.Dispatch<React.SetStateAction<string[]>>,
] => {
    const [pollenTypes, setPollenTypes] = useState<string[]>(() => {
        try {
            const stored = localStorage.getItem(POLLEN_ALLERGY_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(POLLEN_ALLERGY_KEY, JSON.stringify(pollenTypes));
    }, [pollenTypes]);

    return [pollenTypes, setPollenTypes];
};
