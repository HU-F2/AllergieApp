import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";

export type WeatherData = {
    averageTemperature:number;
    averageRain:number;
    averageWind:number;
}

export async function getThreeHourForecast(latitude: Number, longitude: Number) :Promise<WeatherData>{
    console.log(import.meta.env.VITE_BACKEND_API_URL)
  const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/weather/forecast?latitude=${latitude}&longitude=${longitude}`);
  if (!res.ok) {
    throw new Error(`Weather fetch failed: ${res.status}`);
  }
  return await res.json();
}

export const useFetchForecast = (latitude?:number,longitude?:number) =>
    useQuery({
        queryKey: QUERY_KEYS.pollen.map,
        queryFn:()=>{
            if(!latitude || !longitude){
                return Promise.reject()
            } 
            return getThreeHourForecast(latitude,longitude);
        },
        enabled:latitude !== null && longitude !== null
    });
