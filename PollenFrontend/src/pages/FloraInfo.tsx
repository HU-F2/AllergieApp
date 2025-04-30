import { useEffect, useState } from 'react';
import { Flora, fetchFloraList } from '../services/floraInfoService';
import { NavLink } from 'react-router-dom';


const FloraInfo = () => {
    const [floraList, setFloraList] = useState<Flora[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFloraList()
            .then(setFloraList)
            .catch(() => setError('Fout bij laden van flora'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Laden...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="flora-info-container">
            <div className="header-flora-info">
              <NavLink to="/" className="back-button"> ← Terug naar home </NavLink>
              <h1 className="flora-title">Informatie per pollen type</h1>
            </div>
            <div className="flora-grid">
                {floraList.map((flora) => (
                    <div key={flora.id} className="flora-card">
                        <img src={flora.afbeeldingUrl} alt={flora.naam} className="flora-img" />
                        <h2>{flora.naam}</h2>
                        <p>{flora.beschrijving}</p>
                        <p><strong>Hooikoorts:</strong> {flora.hooikoortsInfo}</p>
                        <p><strong>Periode:</strong> {formatDate(flora.pollenPeriodeStart)} - {formatDate(flora.pollenPeriodeEind)}</p>
                        <p><strong>Regio:</strong> {flora.regio}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' });
};

export default FloraInfo;
