import { useEffect, useState } from 'react';

export const useProfilePollenTypes = (): [
    string[],
    React.Dispatch<React.SetStateAction<string[]>>,
] => {
    const [pollenTypes, setPollenTypes] = useState<string[]>(() => {
        try {
            const stored = localStorage.getItem(
                import.meta.env.VITE_POLLEN_ALLERGY_KEY
            );
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(
            import.meta.env.VITE_POLLEN_ALLERGY_KEY,
            JSON.stringify(pollenTypes)
        );
    }, [pollenTypes]);

    return [pollenTypes, setPollenTypes];
};
