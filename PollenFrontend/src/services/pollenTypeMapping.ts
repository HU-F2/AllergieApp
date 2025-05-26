export const pollenRecord: Record<string, { label: string; }> = {
    birch_pollen: { label: 'Berken pollen' },
    grass_pollen: { label: 'Gras pollen' },
    alder_pollen: { label: 'Elzen pollen' },
    mugwort_pollen: { label: 'Absint pollen' },
    olive_pollen: { label: 'Olijf pollen' },
    ragweed_pollen: { label: 'Ambrosia pollen' },
};

/**
 * Geeft de Nederlandse naam terug van een pollentype.
 * @param pollenType sleutel (zoals 'birch_pollen')
 * @returns Nederlandse naam, of null als onbekend.
 */
export function getPollenLabel(pollenType: string): string | null {
    return pollenRecord[pollenType].label ?? null;
}

/**
 * Geeft een lijst van geldige pollen types (bijv. voor validatie of selectielijsten).
 */
export const validPollenTypes: string[] = Object.keys(pollenRecord);

/**
 * Typeveilig alternatief: je kunt deze gebruiken in TypeScript voor strictere types.
 */
export type PollenType = keyof typeof pollenRecord;