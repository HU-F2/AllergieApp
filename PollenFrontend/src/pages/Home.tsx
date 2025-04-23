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
        // Check if geolocation is available
        async function getLocation() {
            // const res = await fetch('https://ipapi.co/json/');
            // const data = await res.json();
            // setLocation({ latitude: data.latitude, longitude: data.longitude });
        }
        getLocation();
    }, []);

    if (isLoading || !data) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Home page</h1>
            <NavLink to="/about">Go to the about page</NavLink>
            <h1>Current Location</h1>
            {data.map((user) => (
                <div key={user.id}>{user.username}</div>
            ))}
            {location ? (
                <div>
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>
                </div>
            ) : (
                <p>Loading location...</p>
            )}
        </div>
    );
};

export default Home;
