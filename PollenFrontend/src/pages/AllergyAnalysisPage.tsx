import { useState } from 'react';
import { PollenDataRequest, useAnalysisQuery } from '../services/symptomsService';
import DatePickerForm from '../components/DatePickerForm';
import AnalysisResults from '../components/AnalysisResults';
import Navbar from '../components/common/navigation/Navbar';
import { useLocationContext } from '../contexts/LocationContext';

const AllergyAnalysisPage = () => {
    const { location } = useLocationContext();
    const [requests, setRequests] = useState<PollenDataRequest[]>([]);
    const { data: results, isLoading, error } = useAnalysisQuery(requests);

    const handleSubmit = (dates: Date[]) => {
        const newRequests: PollenDataRequest[] = dates.map(date => ({
            date: date,
            coordinate: {
                latitude: location!.latitude,
                longitude: location!.longitude
            }
        }));
        setRequests(newRequests);
    };

    return (
        <div className="allergy-analysis-page">
            <Navbar />

            <main className="allergy-analysis-container">
                <h1 className="allergy-analysis-title">Pollen Allergie Analyse</h1>
                <p className="allergy-analysis-description">
                    Selecteer de datums waarop u symptomen ervaarde.
                    Wij analyseren op basis van de pollen concentratie van die datums welke pollen mogelijk uw klachten veroorzaken.
                </p>

                <DatePickerForm onSubmit={handleSubmit} isLoading={isLoading} />

                {error && <p className="allergy-analysis-error">{error.message}</p>}

                <AnalysisResults results={results} isLoading={isLoading} />
            </main>
        </div>
    );
};

export default AllergyAnalysisPage;