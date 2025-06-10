import { useEffect, useState } from 'react';
import { decryptData, encryptData } from '../../utils/encryptionUtils';

export const useProfilePollenTypes = (): [
    string[],
    React.Dispatch<React.SetStateAction<string[]>>,
] => {
    const [pollenTypes, setPollenTypes] = useState<string[]>(() => {
        try {
            const stored = localStorage.getItem(
                import.meta.env.VITE_POLLEN_ALLERGY_KEY
            );
            return stored ? (decryptData(stored) as string[]) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(
            import.meta.env.VITE_POLLEN_ALLERGY_KEY,
            encryptData(pollenTypes)
        );
    }, [pollenTypes]);

    return [pollenTypes, setPollenTypes];
};
