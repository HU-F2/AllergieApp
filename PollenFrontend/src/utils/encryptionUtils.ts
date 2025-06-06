import CryptoJS from 'crypto-js';

const secretKey: string = import.meta.env.VITE_LOCALSTORAGE_KEY;

export const encryptData = (data: unknown): string => {
    const stringData = JSON.stringify(data);
    return CryptoJS.AES.encrypt(stringData, secretKey).toString();
};

export const decryptData = (cipherText: string): unknown | null => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    try {
        return JSON.parse(decrypted);
    } catch (e) {
        return null;
    }
};
