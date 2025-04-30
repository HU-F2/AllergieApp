import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { LocationProvider } from './contexts/LocationContext';
import Home from './pages/Home';
import MapPage from './pages/Map';
import FloraPage from './pages/FloraInfo';


function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <LocationProvider>
                <Router>
                    <Routes>
                        <Route path="/" Component={Home} />
                        <Route path="/map" element={<MapPage />} />
                        <Route path="/info" element={<FloraPage />} />
                    </Routes>
                </Router>
            </LocationProvider>
        </QueryClientProvider>
    );
}

export default App;
