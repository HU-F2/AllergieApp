export interface Flora {
    id: number;
    naam: string;
    afbeeldingUrl: string;
    beschrijving: string;
    hooikoortsInfo: string;
    pollenPeriodeStart: string;
    pollenPeriodeEind: string;
    regio: string;
}

export const fetchFloraList = async (): Promise<Flora[]> => {
    const response = await fetch('http://localhost:5000/api/flora/list');
    if (!response.ok) throw new Error('Failed to fetch flora data');
    return response.json();
};
