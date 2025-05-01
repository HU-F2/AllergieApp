import { Flora } from '../services/floraInfoService';
import { formatDate } from '../utils/utilityFunctions';

type FloraGridProps = {
    floraList: Flora[];
};

const FloraGrid = ({ floraList }: FloraGridProps) => {
    return (
        <div className="flora-grid">
            {floraList.map((flora) => (
                <div key={flora.id} className="flora-card">
                    <img src={flora.afbeeldingUrl} alt={flora.naam} className="flora-img" />
                    <h2>{flora.naam}</h2>
                    <p>{flora.beschrijving}</p>
                    <p><strong>Hooikoorts:</strong> {flora.hooikoortsInfo}</p>
                    <p><strong>Pollen periode:</strong> {formatDate(flora.pollenPeriodeStart)} - {formatDate(flora.pollenPeriodeEind)}</p>
                    <p><strong>Regio:</strong> {flora.regio}</p>
                </div>
            ))}
        </div>
    );
};

export default FloraGrid;
