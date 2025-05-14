import { useEffect, useState } from 'react';

export const useCurrentTime = (
    timestamps: string[]
): [number, React.Dispatch<React.SetStateAction<number>>] => {
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        const now = new Date();
        now.setMinutes(0, 0, 0);

        const amsterdamTime = new Intl.DateTimeFormat('sv-SE', {
            timeZone: 'Europe/Amsterdam',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).format(now);

        const roundedTime = amsterdamTime.slice(0, 16).replace(' ', 'T');

        const index = timestamps.findIndex(
            (timestamp) => timestamp === roundedTime
        );

        setCurrentTime(index !== -1 ? index : 0);
    }, [timestamps]);

    return [currentTime, setCurrentTime];
};
