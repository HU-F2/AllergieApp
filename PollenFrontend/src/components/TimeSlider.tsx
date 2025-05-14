import { useEffect, useState } from 'react';

interface TimeSliderProps {
    times: string[];
    currentTime: number;
    onTimeChange: (timeIndex: number) => void;
}

export const TimeSlider = ({
    times,
    currentTime,
    onTimeChange,
}: TimeSliderProps) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setIndex(currentTime);
    }, [currentTime]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newIndex = parseInt(e.target.value);
        setIndex(newIndex);
        onTimeChange(newIndex);
    };

    return (
        <div style={{ padding: '1rem', width: '100%' }}>
            <input
                type="range"
                min={0}
                max={times.length - 1}
                value={index}
                onChange={handleChange}
                style={{ width: '100%' }}
            />
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                {new Date(times[index]).toLocaleString('nl-NL', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                })}
            </div>
        </div>
    );
};
