import { useState } from 'react';
import './Selector.css';

interface SelectorProps {
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

const Selector: React.FC<SelectorProps> = ({ options, selected, onChange }) => {
    const [isSelecting, setIsSelecting] = useState(false);

    const handleAddTag = (tag: string) => {
        if (!selected.includes(tag)) {
            onChange([...selected, tag]);
        }
        setIsSelecting(false);
    };

    const handleRemoveTag = (tag: string) => {
        onChange(selected.filter((t) => t !== tag));
    };

    return (
        <div className="selector">
            <div className="selectors">
                {selected.map((tag) => (
                    <div key={tag} className="selector-item">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)}>×</button>
                    </div>
                ))}
                <button
                    className="add-btn"
                    onClick={() => setIsSelecting(!isSelecting)}
                >
                    + Voeg pollen toe
                </button>
            </div>

            {isSelecting && (
                <div className="selector-options">
                    {options
                        .filter((tag) => !selected.includes(tag))
                        .map((tag) => (
                            <button
                                key={tag}
                                className="selector-option-btn"
                                onClick={() => handleAddTag(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                </div>
            )}
        </div>
    );
};

export default Selector;
