import { Route, Routes } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from './pages/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MapPage from './pages/Map';

function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route path="/" Component={Home} />
                    <Route path="/map" element={<MapPage />} />
                </Routes>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
