import { useCallback, useEffect, useState } from 'react';
import AnalyseForm from '../components/AnalyseForm';
import AnalysisResults from '../components/AnalysisResults';
import Navbar from '../components/common/navigation/Navbar';
import { useAnalysisRequests } from '../components/hooks/useStoredAnalyseRequests';
import { useStoredResults } from '../components/hooks/useStoredAnalyseResults';
import LocationPermissionNotice from '../components/LocationPermissionNotice';
import { useLocationContext } from '../contexts/LocationContext';
import { useAnalysisQuery } from '../services/symptomsService';

const AllergyAnalysisPage = () => {
    const { location } = useLocationContext();
    const { requests, updateRequests, clearRequests } = useAnalysisRequests();
    const {
        data: apiResults,
        isLoading,
        error,
    } = useAnalysisQuery(requests, {
        skip: requests.length === 0,
    });
    const [showLocationNotice, setShowLocationNotice] = useState(false);
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

    useEffect(() => {
        if (!location) {
            setShowLocationNotice(true);
        }
    }, [location]);

    return (
        <>
            <Navbar />
            <div className="allergy-analysis-page">
                <LocationPermissionNotice
                    isOpen={showLocationNotice}
                    onClose={() => setShowLocationNotice(false)}
                />

                <div className={`allergy-analysis-container`}>
                    <h1 className="allergy-analysis-title">
                        Pollen Allergie Analyse
                    </h1>
                    <p className="allergy-analysis-description">
                        Selecteer de datums waarop u symptomen ervaarde. Wij
                        analyseren op basis van de pollen concentratie van die
                        datums op de gekozen locatie welke pollen mogelijk uw
                        klachten veroorzaken.
                    </p>

                    <AnalyseForm
                        onSubmit={updateRequests}
                        onInvalidateResults={handleInvalidateResults}
                        isLoading={isLoading}
                        isDisabled={!location}
                        location={location}
                    />

                    {error && (
                        <p className="allergy-analysis-error">
                            {error.message}
                        </p>
                    )}

                    <div className="medical-alert-banner">
                        <p>
                            <strong>Let op: </strong> Dit medisch advies is
                            slechts indicatief en vervangt geen professioneel
                            medisch consult. Raadpleeg bij twijfel altijd een
                            arts.
                        </p>
                    </div>

                    <AnalysisResults
                        results={storedResults || apiResults}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </>
    );
};

export default AllergyAnalysisPage;
