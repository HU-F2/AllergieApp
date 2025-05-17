import { AnalysisResponse, AllergySuggestion } from '../services/symptomsService';

interface AnalysisResultsProps {
  results: AnalysisResponse | undefined;
  isLoading: boolean;
}

const AnalysisResults = ({ results, isLoading }: AnalysisResultsProps) => {
  if (isLoading) {
    return <div className="analysis-loader">Analyseren...</div>;
  }

  if (!results) return null;

  return (
    <div className="analysis-results-container">
      <h3 className="analysis-results-title">Resultaten</h3>
      <p className="analysis-results-disclaimer">{results.disclaimer}</p>

      <div className="analysis-suggestions-list">
        {results.suggestions.map((suggestion: AllergySuggestion, index: number) => (
          <div key={index} className="analysis-suggestion-item">
            <h4 className="analysis-suggestion-title">{suggestion.pollenType}</h4>
            <p>Gemiddelde concentratie: {suggestion.averageConcentration.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisResults;