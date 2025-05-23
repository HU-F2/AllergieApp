/**
 * Global type declarations for Electron-specific window variables
 */
declare global {
  interface Window {
    electronGlobalVariables?: {
        // Flag indicating if running in desktop environment
        IN_DESKTOP_ENV?: boolean;
    };
  }
}

/**
 * Converteert een datumstring naar een geformatteerde Nederlandse datum (bijv. "15 januari")
 * @param {string} dateStr - Datumstring in een door Date.parse() herkenbaar formaat (bijv. YYYY-MM-DD)
 * @returns {string} Geformatteerde datum in Nederlands formaat (dag + maand)
 * @throws {Error} Als de invoerstring geen geldige datum is
 * @example
 * // Returns "15 januari"
 * formatDate("2023-01-15");
 * 
 * // Throws an error
 * formatDate("ongeldige-datum");
 */
export const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
        throw new Error(`Ongeldige datumstring: ${dateStr}`);
    }
    
    return date.toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
    });
};

/**
 * Formatteert een datum naar Nederlands lang formaat (bijv. "maandag 15 januari")
 * @param date - Optionele Date object (standaard: huidige datum)
 * @returns Geformatteerde datumstring
 */
export const formatDutchDate = (date: Date = new Date()): string => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    };
    
    return new Intl.DateTimeFormat('nl-NL', options).format(date);
};

/**
 * Checks if the application is running in an Electron environment
 * by verifying the presence of Electron-specific global variables.
 * 
 * @returns {boolean} True if running in Electron, false otherwise
 */
export const isElectron = (): boolean => {
    return window?.electronGlobalVariables?.IN_DESKTOP_ENV === true;
};

/**
 * Checks and logs the Electron environment status
 * 
 * @example
 * checkElectronGlobalVariables();
 * // Logs: 'Is Electron: true' or 'Electron API not available (probably in browser)'
 */
export const checkElectronGlobalVariables = (): void => {
    if (window.electronGlobalVariables) {
        console.log('Is Electron:', window.electronGlobalVariables.IN_DESKTOP_ENV);
    } else {
        console.log('Electron API not available (probably in browser)');
    }
};