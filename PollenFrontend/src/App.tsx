import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import MapPage from './pages/Map';
import AboutPage from './pages/About';
import EducationPage from './pages/Education';
import NotFoundPage from './pages/NotFoundPage';

function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/education" element={<EducationPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Router>
        </QueryClientProvider>
    );
}

export default App;