import { useEffect, useState } from 'react';
import { Flora, fetchFloraList } from '../services/floraInfoService';
import FloraGrid from '../components/FloraGrid';
import Navbar from '../components/common/navigation/Navbar';


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

    return (
        <div className="flora-info-container">
            <Navbar />
            <div className="header-flora-info">
                <h1 className="flora-title">Informatie over flora die hooikoorts klachten kunnen veroorzaken</h1>
            </div>
            {loading ? (
                <div className="flora-grid-loading">
                    <p>Flora-informatie laden...</p>
                </div>
            ) : error ? (
                <p className="flora-error">{error}</p>
            ) : (
                <FloraGrid floraList={floraList} />
            )}
        </div>
    );
};

export default FloraInfo;
