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