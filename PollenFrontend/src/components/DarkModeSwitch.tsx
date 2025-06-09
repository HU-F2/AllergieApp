import { useThemeContext } from '../contexts/ThemeContext';

const DarkModeSwitch = () => {
    const { isDarkMode, setIsDarkMode } = useThemeContext();
    return (
        <label className="theme-toggle">
            <input
                type="checkbox"
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
                className="toggle-input"
            />
            <span className="slider">
                <span className={`${isDarkMode ? 'moon' : 'sun'} icon`}>
                    {isDarkMode ? '🌙' : '☀️'}
                </span>
            </span>
        </label>
    );
};

export default DarkModeSwitch;
