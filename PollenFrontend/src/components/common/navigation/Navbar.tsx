import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useThemeContext } from '../../../contexts/ThemeContext';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isDarkMode } = useThemeContext();

    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const closeMenu = () => setMenuOpen(false);

    const navLinks = (
        <>
            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                }
                onClick={closeMenu}
            >
                Home
            </NavLink>
            <NavLink
                to="/education"
                className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                }
                onClick={closeMenu}
            >
                Educatie
            </NavLink>
            <NavLink
                to="/flora-pollen-info"
                className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                }
                onClick={closeMenu}
            >
                Flora Pollen Informatie
            </NavLink>
            <NavLink
                to="/analysis"
                className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                }
                onClick={closeMenu}
            >
                Pollen Allergie Analyse
            </NavLink>
            <NavLink
                to="/profile"
                className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                }
                onClick={closeMenu}
            >
                Mijn Profiel
            </NavLink>
        </>
    );

    return (
        <div className="full-navbar-container">
            <nav className="navbar">
                <div className="navbar-logo">
                    <NavLink to="/" className="navbar-logo-link">
                        {/* {import.meta.env.VITE_APP_NAME} */}
                        {/* Add logo */}
                        <img
                            src={`/images/Logo-${isDarkMode ? 'dark' : 'light'}.png`}
                        />
                    </NavLink>
                </div>

                <div className="navbar-links navbar-desktop-only">
                    {navLinks}
                </div>

                <button
                    className="hamburger navbar-mobile-only"
                    onClick={toggleMenu}
                    aria-label="Open menu"
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
            </nav>

            {menuOpen && (
                <div className="dropdown-menu navbar-mobile-only">
                    {navLinks}
                </div>
            )}
        </div>
    );
};

export default Navbar;
