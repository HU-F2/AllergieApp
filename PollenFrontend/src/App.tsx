import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { LocationProvider } from './contexts/LocationContext';
import { SelectedPollenProvider } from './contexts/SelectedPollenContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AllergyAnalysisPage from './pages/AllergyAnalysisPage';
import EducationPage from './pages/Education';
import FloraPage from './pages/FloraInfo';
import Home from './pages/Home';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/Profile';

function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <LocationProvider>
                <SelectedPollenProvider>
                    <ThemeProvider>
                        <Router>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route
                                    path="/flora-pollen-info"
                                    element={<FloraPage />}
                                />
                                <Route
                                    path="/education"
                                    element={<EducationPage />}
                                />
                                <Route
                                    path="/analysis"
                                    element={<AllergyAnalysisPage />}
                                />
                                <Route
                                    path="/profile"
                                    element={<ProfilePage />}
                                />
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </Router>
                    </ThemeProvider>
                </SelectedPollenProvider>
            </LocationProvider>
        </QueryClientProvider>
    );
}

export default App;
