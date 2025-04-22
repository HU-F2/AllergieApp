import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'
import Card from '../Card';

type Props = {}
const items = [1,2,3,4]

const Home = (props: Props) => {
  const [location, setLocation] = useState<{latitude:number, longitude:number}|null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if geolocation is available
    async function getLocation() {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      setLocation({latitude:data.latitude,longitude:data.longitude})
    }
    getLocation();
  }, []);

  return (
    <div>
        <h1>Home page</h1>
        <NavLink to="/about">Go to the about page</NavLink>
        <h1>Current Location</h1>
        {items.map((item)=><Card item={item}/>)}
        {error && <p>{error}</p>}
        {location ? (
          <div>
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
          </div>
        ) : (
          <p>Loading location...</p>
        )}
    </div>
  )
}

export default Home