import { getPollenLabel } from '../services/pollenTypeMapping';
import { AnalysisResponse, AllergySuggestion } from '../services/symptomsService';

interface AnalysisResultsProps {
    results: AnalysisResponse | undefined;
    isLoading: boolean;
}

const AnalysisResults = ({ results, isLoading }: AnalysisResultsProps) => {
    if (isLoading) return <div className="analysis-loader">Analyseren...</div>;
    if (!results) return null;

    const sortedSuggestions = [...results.suggestions].sort(
        (a, b) => b.averageConcentration - a.averageConcentration
    );

    return (
        <div className="analysis-results-container">
            <h3 className="analysis-results-title">Resultaten</h3>
            <div className="medical-alert-banner">
                <p><strong>Let op: </strong> Dit medisch advies is slechts indicatief en vervangt geen professioneel medisch consult. Raadpleeg bij twijfel altijd een arts.</p>
            </div>

            <div className="analysis-suggestions-grid">
                {sortedSuggestions.map((suggestion: AllergySuggestion, index: number) => (
                    <div key={index} className={`suggestion-card rank-${index + 1}`}>
                        <div className="suggestion-number">{index + 1}</div>
                        <div className="suggestion-content">
                            <h4 className="suggestion-title">{getPollenLabel(suggestion.pollenType)}</h4>
                            <p className="suggestion-label">Allergie-indicatie</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalysisResults;