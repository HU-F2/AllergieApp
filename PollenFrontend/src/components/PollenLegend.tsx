import React from 'react';
import { pollenMeta, PollenTypes } from './PollenMap';

type PollenLegendProps = {
    pollenType: PollenTypes;
};

export const PollenLegend = ({ pollenType }: PollenLegendProps) => {
    const { baseColor, min, max } = pollenMeta[pollenType];

    const gradient = `linear-gradient(to right, 
        rgba(${baseColor.join(',')}, 0.1), 
        rgba(${baseColor.join(',')}, 1))`;

    return (
        <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            background: 'white',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 0 6px rgba(0,0,0,0.3)',
            zIndex: 1000,
            fontSize: '0.9rem',
            maxWidth: '300px',
        }}>
            <div style={{ marginTop: '6px' }}>
                <div style={{
                    background: gradient,
                    height: '20px',
                    borderRadius: '4px',
                    marginBottom: '6px'
                }} />
                <div style={{
                    display: 'flex',
                    gap: '75px',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem'
                }}>
                    <span>Weinig ({min})</span>
                    <span>Veel ({max})</span>
                </div>
            </div>
            {/* <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#555' }}>
                Kleurintensiteit geeft hoeveelheid {pollenMeta[pollenType].rawName}-pollen aan.
            </div> */}
        </div>
    );
};
