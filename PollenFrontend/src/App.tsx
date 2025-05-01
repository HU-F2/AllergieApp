import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import MapPage from './pages/Map';
import FloraPage from './pages/FloraInfo';
import EducationPage from './pages/Education';
import NotFoundPage from './pages/NotFoundPage';
import { LocationProvider } from './contexts/LocationContext';

function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <LocationProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/map" element={<MapPage />} />
                        <Route path="/flora-pollen-info" element={<FloraPage />} />
                        <Route path="/education" element={<EducationPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Router>
            </LocationProvider>
        </QueryClientProvider>
    );
}

export default App;