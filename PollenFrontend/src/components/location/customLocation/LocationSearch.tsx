import React, { useState } from 'react';
import { LocationData } from '../../../services/locationService';
import './LocationSearch.css';

interface Props {
    locations: LocationData[];
    onSelectLocation: (location: LocationData) => void;
}

const LocationSearch = ({ locations, onSelectLocation }: Props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLocations, setFilteredLocations] = useState<LocationData[]>(
        []
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term === '') {
            setFilteredLocations([]);
            return;
        }

        const filtered = locations.filter((location) =>
            location.name.toLowerCase().includes(term.toLowerCase())
        ).sort((a, b) => {
            const key = term.toLowerCase();
            const isGoodMatchA = a.name.toLowerCase().startsWith(key);
            const isGoodMatchB = b.name.toLowerCase().startsWith(key);
            return Number(isGoodMatchB) - Number(isGoodMatchA);
        });
        setFilteredLocations(filtered);
    };

    const handleLocationSelect = (location: LocationData) => {
        onSelectLocation(location);
        setSearchTerm(location.name);
        setFilteredLocations([]);
    };

    return (
        <div className="location-search-container">
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Zoek een gemeente"
                className="location-search-input"
            />

            {filteredLocations.length > 0 && (
                <ul className="location-suggestions">
                    {filteredLocations.map((location) => (
                        <li
                            key={location.name}
                            onClick={() => handleLocationSelect(location)}
                        >
                            {location.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LocationSearch;
