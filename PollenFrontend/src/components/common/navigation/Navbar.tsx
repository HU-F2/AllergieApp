import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(prev => !prev);
    const closeMenu = () => setMenuOpen(false);

    const navLinks = (
        <>
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                Home
            </NavLink>
            <NavLink to="/map" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                Map
            </NavLink>
            <NavLink to="/education" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                Educatie
            </NavLink>
            <NavLink to="/flora-pollen-info" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                Flora Pollen Informatie
            </NavLink>
        </>
    );

    return (
        <div className="full-navbar-container">
            <nav className="navbar">
                <div className="navbar-logo">
                    <NavLink to="/" className="navbar-logo-text">
                        {import.meta.env.VITE_APP_NAME}
                    </NavLink>
                </div>

                <div className="navbar-links desktop-only">
                    {navLinks}
                </div>

                <button className="hamburger mobile-only" onClick={toggleMenu} aria-label="Open menu">
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
            </nav>

            {menuOpen && (
                <div className="dropdown-menu mobile-only">
                    {navLinks}
                </div>
            )}
        </div>
    );
};

export default Navbar;