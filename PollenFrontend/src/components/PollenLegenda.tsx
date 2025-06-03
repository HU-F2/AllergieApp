import { pollenMeta, PollenTypes } from './PollenMap';

type PollenLegendaProps = {
    pollenType: PollenTypes;
};

export const PollenLegenda = ({ pollenType }: PollenLegendaProps) => {
    const { baseColor, min, max } = pollenMeta[pollenType];

    const gradient = `linear-gradient(to right,
        rgba(240, 240, 240),
        rgba(${baseColor.join(',')}, 1))`;

    return (
        <div className="pollenLegenda">
            <div className="pollenLegenda-gradient"
                style={{
                    background: gradient,
                }}
            />
            <div className="pollenLegenda-text">
                <span>Weinig ({min})</span>
                <span>Veel ({max})</span>
            </div>
        </div>
    );
};
