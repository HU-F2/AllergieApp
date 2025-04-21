// import { config } from '../config';

const API_URL = "http://localhost:3000"

export async function fetchTestMessage(): Promise<string> {
    try {
        const response = await fetch(`${API_URL}/api/test`);
        if (!response.ok) throw new Error('Netwerkfout');
        console.log(await response.text());
        return await response.text();
    } catch (err) {
        console.error('Fout bij ophalen van testbericht:', err);
        return 'Fout bij ophalen';
    }
}
