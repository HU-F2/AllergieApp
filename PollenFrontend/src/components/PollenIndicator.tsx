import { useEffect, useRef } from 'react';

interface Props {
    min: number;
    max: number;
    value: number;
    name: string;
    onDangerLevelReached?: () => void;
}

const PollenIndicator = ({
    min,
    max,
    value,
    name,
    onDangerLevelReached,
}: Props) => {
    const prevIsDangerLevel = useRef(false);

    const segments = [
        { color: 'green', label: 'Zeer lage pollen' },
        { color: 'lightgreen', label: 'Lage pollen' },
        { color: 'yellow', label: 'Medium pollen' },
        { color: 'orange', label: 'Hoge pollen' },
        { color: 'red', label: 'Zeer hoge pollen' },
    ];

    const clampedValue = Math.min(Math.max(value, min), max);
    const range = max - min;
    const percentage = (clampedValue - min) / range;
    const angle = percentage * 180 - 90;
    const radius = 140;

    const centerX = 150;
    const centerY = 150;
    const pointerX =
        centerX + (radius - 5) * Math.cos((angle - 90) * (Math.PI / 180));
    const pointerY =
        centerY + (radius - 5) * Math.sin((angle - 90) * (Math.PI / 180));

    const segmentIndex = Math.floor(percentage * segments.length);
    const label = segments[segmentIndex]?.label || '';
    const isDangerLevel = segmentIndex >= 4;

    useEffect(() => {
        if (
            isDangerLevel &&
            !prevIsDangerLevel.current &&
            onDangerLevelReached
        ) {
            onDangerLevelReached();
        }

        prevIsDangerLevel.current = isDangerLevel;
    }, [isDangerLevel, onDangerLevelReached]);

    return (
        <div className="pollen-indicator-container">
            <svg viewBox="0 0 300 150" className="pollen-indicator-svg">
                {segments.map((seg, i) => {
                    const startAngle = (i / segments.length) * 180 - 90;
                    const endAngle = ((i + 1) / segments.length) * 180 - 90;

                    const x1 =
                        centerX +
                        radius * Math.cos((startAngle - 90) * (Math.PI / 180));
                    const y1 =
                        centerY +
                        radius * Math.sin((startAngle - 90) * (Math.PI / 180));
                    const x2 =
                        centerX +
                        radius * Math.cos((endAngle - 90) * (Math.PI / 180));
                    const y2 =
                        centerY +
                        radius * Math.sin((endAngle - 90) * (Math.PI / 180));

                    return (
                        <path
                            key={i}
                            d={`M${centerX},${centerY} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`}
                            fill={seg.color}
                        />
                    );
                })}

                <circle
                    className="pollenIndicator-center-circle"
                    cx={centerX}
                    cy={centerY}
                    r={radius - 10}
                />

                <circle cx={pointerX} cy={pointerY} r="10" fill="#fff" />
                <circle cx={pointerX} cy={pointerY} r="6" fill="#000" />

                <text
                    className="pollenindicator-text"
                    x="150"
                    y="110"
                    textAnchor="middle"
                    fontSize="24"
                >
                    {value.toFixed(1)}/m³
                </text>
                <text
                    className="pollenindicator-text"
                    x="150"
                    y="140"
                    textAnchor="middle"
                    fontSize="24"
                >
                    {name}
                </text>
                <text
                    className="pollenindicator-text"
                    x="150"
                    y="170"
                    textAnchor="middle"
                    fontSize="16"
                >
                    {label}
                </text>
            </svg>
        </div>
    );
};

export default PollenIndicator;
