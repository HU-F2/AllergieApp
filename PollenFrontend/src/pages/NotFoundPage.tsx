// src/pages/NotFoundPage.tsx
import Navbar from '../components/Navbar';
import { NavLink } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div>
            <Navbar />
            <div className="not-found-container">
                <h1>404 - Pagina niet gevonden</h1>
                <p>Oeps! De pagina die je zoekt bestaat niet of is verplaatst.</p>
                <NavLink to="/" className="back-home-link">
                    Terug naar Home
                </NavLink>
            </div>
        </div>
    );
};

export default NotFoundPage;