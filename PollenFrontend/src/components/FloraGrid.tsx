import { Flora } from '../services/floraInfoService';
import { formatDate } from '../utils/utilityFunctions';
import { useProfilePollenTypes } from './hooks/useProfilePollenTypes';

type FloraGridProps = {
    floraList: Flora[];
};

const FloraGrid = ({ floraList }: FloraGridProps) => {
    const [pollenTypes] = useProfilePollenTypes();

    const getMatchIndex = (name: string) => {
        return pollenTypes.findIndex((type) =>
            name.toLowerCase().includes(type.toLowerCase())
        );
    };

    const sortedPollenData = floraList.sort((a, b) => {
        const indexA = getMatchIndex(a.naam);
        const indexB = getMatchIndex(b.naam);

        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;

        return indexA - indexB;
    });

    return (
        <div className="flora-grid">
            {sortedPollenData.map((flora) => (
                <div key={flora.id} className="flora-card">
                    <img
                        src={flora.afbeeldingUrl}
                        alt={flora.naam}
                        className="flora-img"
                    />
                    <h2>{flora.naam}</h2>
                    <p>{flora.beschrijving}</p>
                    <p>
                        <strong>Hooikoorts:</strong> {flora.hooikoortsInfo}
                    </p>
                    <p>
                        <strong>Pollen periode:</strong>{' '}
                        {formatDate(flora.pollenPeriodeStart)} -{' '}
                        {formatDate(flora.pollenPeriodeEind)}
                    </p>
                    <p>
                        <strong>Regio:</strong> {flora.regio}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default FloraGrid;
