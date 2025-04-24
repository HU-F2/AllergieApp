// src/pages/Home.tsx

import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useFetchUsers } from '../services/userService';

type Props = {};

const Home = (props: Props) => {
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);

    const { data, isLoading, error } = useFetchUsers();

    useEffect(() => {
        async function getLocation() {
            // Fetch user location logic (commented out for now)
        }
        getLocation();
    }, []);

    if (isLoading || !data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="home-container">
            <h1 className="home-title">Polinator</h1>
            <div className="menu">
                <NavLink to="/map" className="link-button green">
                    View Pollen Map
                </NavLink>
            </div>
        </div>
    );
};

export default Home;
