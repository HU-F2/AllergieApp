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

    let pollenScore = 1 - Math.min(pollenRatio, 1);

    const rainScore = averageRain < 1.5
        ? 1
        : averageRain >= 3
        ? 0
        : 1 - (averageRain - 1.5) / 1.5;

    let tempScore = 0;
    if (averageTemp >= 19 && averageTemp <= 23) tempScore = 0.8;
    else if ((averageTemp < 15)) tempScore = 0.3;
    else if ((averageTemp >= 15 && averageTemp < 19)) tempScore = 0.5;
    else if ((averageTemp > 23 && averageTemp <= 27)) tempScore = 1;

    const total = pollenScore * 0.6 + rainScore * 0.2 + tempScore * 0.2;
    return Math.round(total * 10);
}
