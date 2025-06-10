using System.Globalization;
using System.Text.Json;
using PollenBackend.Models;

namespace PollenBackend.Services
{
    public interface IWeatherService
    {
        /// <summary>
        /// Haalt de gemiddelde weersvoorspelling op voor de komende 3 uur.
        /// </summary>
        /// <param name="latitude">Breedtegraad van de gebruiker</param>
        /// <param name="longitude">Lengtegraad van de gebruiker</param>
        /// <returns>WeatherData object met gemiddelde temperatuur, regen en wind</returns>
        public Task<WeatherData> GetThreeHourForecast(double latitude, double longitude);
    }

    public class WeatherService : IWeatherService
    {
        private readonly HttpClient _httpClient;

        public WeatherService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<WeatherData> GetThreeHourForecast(double latitude, double longitude)
        {
            if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180)
                throw new ArgumentOutOfRangeException("Geef een valide latitude en longitude op.");
            
            string baseUrl = "https://api.open-meteo.com/v1/forecast";
            string query = $"?latitude={latitude.ToString(CultureInfo.InvariantCulture)}&longitude={longitude.ToString(CultureInfo.InvariantCulture)}&hourly=temperature_2m,rain,wind_speed_10m&timezone=Europe%2FBerlin";
            string fullUrl = baseUrl + query;
            HttpResponseMessage response = await _httpClient.GetAsync(fullUrl);
            if (!response.IsSuccessStatusCode)
            {
                throw new HttpRequestException("Momenteel kunnen we de weersvoorspelling niet ophalen. Onze excuses.");
            }
            string responseBody = await response.Content.ReadAsStringAsync();

            using JsonDocument doc = JsonDocument.Parse(responseBody);
            var hourly = doc.RootElement.GetProperty("hourly");

            var weatherData = ParseWeatherData(hourly);
            return CalculateThreeHourAverages(weatherData);
        }

        private (List<string> Time, List<double> Temperature, List<double> Rain, List<double> Wind) ParseWeatherData(JsonElement hourly)
        {
            var timeArray = hourly.GetProperty("time").EnumerateArray().Select(t => t.GetString()!).ToList();
            var temperatureArray = hourly.GetProperty("temperature_2m").EnumerateArray().Select(t => t.GetDouble()).ToList();
            var rainArray = hourly.GetProperty("rain").EnumerateArray().Select(r => r.GetDouble()).ToList();
            var windArray = hourly.GetProperty("wind_speed_10m").EnumerateArray().Select(w => w.GetDouble()).ToList();

            return (timeArray, temperatureArray, rainArray, windArray);
        }

        private WeatherData CalculateThreeHourAverages((List<string> Time, List<double> Temperature, List<double> Rain, List<double> Wind) data)
        {
            double tempSum = 0, rainSum = 0, windSum = 0;
            int count = 0;

            DateTime nowUtc = DateTime.UtcNow;
            DateTime upperBound = nowUtc.AddHours(3);

            for (int i = 0; i < data.Time.Count; i++)
            {
                if (DateTime.TryParse(data.Time[i], null, DateTimeStyles.AssumeUniversal, out DateTime forecastTime))
                {
                    if (forecastTime > nowUtc && forecastTime <= upperBound)
                    {
                        tempSum += data.Temperature[i];
                        rainSum += data.Rain[i];
                        windSum += data.Wind[i];
                        count++;
                    }
                }
            }

            if (count == 0)
            {
                throw new Exception("Geen bruikbare data voor de komende 3 uur gevonden.");
            }

            return new WeatherData
            {
                AverageTemperature = tempSum / count,
                AverageRain = rainSum / count,
                AverageWind = windSum / count
            };
        }
    }
}