import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { LocationProvider } from './contexts/LocationContext';
import EducationPage from './pages/Education';
import FloraPage from './pages/FloraInfo';
import Home from './pages/Home';
import MapPage from './pages/Map';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/Profile';
import { SelectedPollenProvider } from './contexts/SelectedPollenContext';

function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <LocationProvider>
                <SelectedPollenProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/map" element={<MapPage />} />
                            <Route path="/flora-pollen-info" element={<FloraPage />} />
                            <Route path="/education" element={<EducationPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </Router>
                </SelectedPollenProvider>
            </LocationProvider>
        </QueryClientProvider>
    );
}

export default App;