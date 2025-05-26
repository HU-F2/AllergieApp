import { useCallback, useEffect } from 'react';
import { useAnalysisQuery } from '../services/symptomsService';
import AnalyseForm from '../components/AnalyseForm';
import AnalysisResults from '../components/AnalysisResults';
import Navbar from '../components/common/navigation/Navbar';
import { useStoredResults } from '../components/hooks/useStoredAnalyseResults';
import { useAnalysisRequests } from '../components/hooks/useStoredAnalyseRequests';

const AllergyAnalysisPage = () => {
    const { requests, updateRequests, clearRequests } = useAnalysisRequests();
    const { data: apiResults, isLoading, error } = useAnalysisQuery(requests, {
        skip: requests.length === 0
    });

    const [storedResults, saveResults] = useStoredResults(requests);

    // Callback voor het resetten van results
    const handleInvalidateResults = useCallback(() => {
        clearRequests();
        saveResults(null); // Expliciet null opslaan
    }, [clearRequests, saveResults]);

    useEffect(() => {
        if (apiResults) {
            saveResults(apiResults);
        }
    }, [apiResults]);

    return (
        <div className="allergy-analysis-page">
            <Navbar />

            <div className="allergy-analysis-container">
                <h1 className="allergy-analysis-title">Pollen Allergie Analyse</h1>
                <p className="allergy-analysis-description">
                    Selecteer de datums waarop u symptomen ervaarde.
                    Wij analyseren op basis van de pollen concentratie van die datums welke pollen mogelijk uw klachten veroorzaken.
                </p>

                <AnalyseForm
                    onSubmit={updateRequests}
                    onInvalidateResults={handleInvalidateResults}
                    isLoading={isLoading}
                />

                {error && <p className="allergy-analysis-error">{error.message}</p>}

                <AnalysisResults results={storedResults || apiResults} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default AllergyAnalysisPage;