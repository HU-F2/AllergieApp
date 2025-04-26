import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <NavLink to="/" className="navbar-logo-text">
                    {import.meta.env.VITE_APP_NAME}
                </NavLink>
            </div>
            <div className="navbar-links">
                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Home
                </NavLink>
                <NavLink to="/map" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Map
                </NavLink>
                <NavLink to="/education" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Education
                </NavLink>
            </div>
        </nav>
    );
};

export default Navbar;