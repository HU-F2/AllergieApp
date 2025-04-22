import { useQuery } from "@tanstack/react-query";

const fetchWeatherForecast = async () => {
    const response = await fetch("http://localhost:5000/weatherforecast");
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

export const useWeatherForecast = useQuery({queryKey:["test"], queryFn:fetchWeatherForecast});