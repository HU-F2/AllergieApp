// src/utils/calculateWalkScore.ts

import { PollenTypes, pollenMeta } from '../components/PollenMap'; // Adjust path as needed

export function calculateWalkScore({
    pollenType,
    pollenValue,
    averageRain,
    averageTemp,
}: {
    pollenType: PollenTypes;
    pollenValue: number;
    averageRain: number;
    averageTemp: number;
}): number {
    const max = pollenMeta[pollenType].max;
    const pollenRatio = pollenValue / max;
    const lowPollenPercentage = 0.4
    const pollenScore = pollenRatio <= lowPollenPercentage ? 1 : pollenRatio >= 1 ? 0 : 1 - (pollenRatio - lowPollenPercentage) / 0.6;

    const rainScore = averageRain < 1.5
        ? 1
        : averageRain >= 3
        ? 0
        : 1 - (averageRain - 1.5) / 1.5;

    let tempScore = 0;
    if (averageTemp >= 17 && averageTemp <= 23) tempScore = 1;
    else if ((averageTemp >= 13 && averageTemp < 17) || (averageTemp > 23 && averageTemp <= 27)) tempScore = 0.5;

    const total = pollenScore * 0.4 + rainScore * 0.3 + tempScore * 0.3;
    return Math.round(total * 10);
}
