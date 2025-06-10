import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

type ThemeContextType = {
    isDarkMode: boolean;
    setIsDarkMode: (isDarkMode: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

type Props = {
    children: ReactNode;
};

const THEME_STORAGE_KEY = 'theme-preference';

export const ThemeProvider = ({ children }: Props) => {
    const [userPreference, setUserPreference] = useState<boolean | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Load preference from localStorage
        const storedPreference = localStorage.getItem(THEME_STORAGE_KEY);
        if (storedPreference !== null) {
            const value = storedPreference === 'dark';
            setUserPreference(value);
            setIsDarkMode(value);
        } else {
            const mediaQuery = window.matchMedia(
                '(prefers-color-scheme: dark)'
            );
            setIsDarkMode(mediaQuery.matches);
        }
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handler = (e: MediaQueryListEvent) => {
            if (userPreference === null) {
                setIsDarkMode(e.matches);
            }
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [userPreference]);

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleDarkMode = (value: boolean) => {
        setUserPreference(value);
        setIsDarkMode(value);
        localStorage.setItem(THEME_STORAGE_KEY, value ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider
            value={{
                isDarkMode,
                setIsDarkMode: toggleDarkMode,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
};
