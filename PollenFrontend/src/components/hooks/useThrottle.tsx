import { useEffect, useState } from 'react';

export const useThrottle = <T,>(value: T, delay: number): T => {
    const [throttledValue, setThrottledValue] = useState<T>(value);

    useEffect(() => {
        const handler: ReturnType<typeof setTimeout> = setTimeout(() => {
            setThrottledValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return throttledValue;
};
