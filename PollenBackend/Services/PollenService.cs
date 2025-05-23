using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;
using PollenBackend.Data;
using PollenBackend.Models;

namespace PollenBackend.Services
{
    public interface IPollenService
    {
        /// <summary>
        /// Retrieves the current pollen data for a specific location based on latitude and longitude.
        /// </summary>
        /// <returns>A <see cref="PollenData"/> object containing pollen data for the specified location.</returns>
        /// <exception cref="HttpRequestException">Thrown when the API request fails or if the response is invalid.</exception>
        public Task<PollenData> GetCurrentPollenFromLocation(double latitude, double longitude);

        /// <summary>
        /// Retrieves the pollen map data for all locations.
        /// </summary>
        /// <returns>A collection of <see cref="PollenData"/> objects.</returns>
        /// <exception cref="HttpRequestException">Thrown when the API request fails.</exception>
        Task<IEnumerable<PollenData>> GetPollenMap();
    }

    public class PollenService : IPollenService
    {
        private readonly AppDbContext _dbContext;
        private readonly ILocationService _locationService;
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _memoryCache;
        // Pollen types that get requested
        private static string POLLEN_TYPES="alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen";

        public PollenService(AppDbContext dbContext, ILocationService locationService, HttpClient httpClient, IMemoryCache memoryCache)
        {
            _dbContext = dbContext;
            _locationService = locationService;
            _httpClient = httpClient;
            _memoryCache = memoryCache;
        }

        public async Task<PollenData> GetCurrentPollenFromLocation(double latitude, double longitude)
        {
            var cacheKey = $"PollenData-{latitude}-{longitude}";

            if (_memoryCache.TryGetValue(cacheKey, out PollenData? cachedData))
            {
                return cachedData!;
            }

            string baseUrl = "https://air-quality-api.open-meteo.com/v1/air-quality";
            string query = $"?latitude={latitude}&longitude={longitude}&current={POLLEN_TYPES}&timezone=Europe%2FBerlin";
            string fullUrl = baseUrl + query;

            // Make API request
            HttpResponseMessage response = await _httpClient.GetAsync(fullUrl);

            if (!response.IsSuccessStatusCode)  
            {
                var reason = JsonSerializer.Deserialize<JsonElement>(await response.Content.ReadAsStringAsync())
                    .GetProperty("reason").GetString();
                throw new HttpRequestException($"Request to pollen API failed: {reason}");
            }
            string responseBody = await response.Content.ReadAsStringAsync();

            var pollenData = ParseCurrentPollenData(responseBody);

            // Set cache
            _memoryCache.Set(cacheKey, pollenData, DateTimeOffset.Now.AddMinutes(60));

            return pollenData;
        }

        public async Task<IEnumerable<PollenData>> GetPollenMap()
        {
            // Api docs: https://open-meteo.com/en/docs/air-quality-api
            var cacheKey = $"PollenMap";

            if (_memoryCache.TryGetValue(cacheKey, out List<PollenData>? cachedData))
            {
                return cachedData!;
            }

            // Get locations from db
            var locations = (await _locationService.GetLocations()).ToList();

            // Prepare coordinates
            string latitudesParam = string.Join(",", locations.Select(loc => loc.Latitude));
            string longitudesParam = string.Join(",", locations.Select(loc => loc.Longitude));

            // Build URL
            string baseUrl = "https://air-quality-api.open-meteo.com/v1/air-quality";
            string startDate = DateTime.UtcNow.ToString("yyyy-MM-dd");
            string endDate = DateTime.UtcNow.AddDays(2).ToString("yyyy-MM-dd");
            string query = $"?latitude={latitudesParam}&longitude={longitudesParam}&hourly={POLLEN_TYPES}&start_date={startDate}&end_date={endDate}&timezone=Europe%2FBerlin";
            string fullUrl = baseUrl + query;

            // Make API request
            HttpResponseMessage response = await _httpClient.GetAsync(fullUrl);

            if (!response.IsSuccessStatusCode)  
            {
                var reason = JsonSerializer.Deserialize<JsonElement>(await response.Content.ReadAsStringAsync())
                    .GetProperty("reason").GetString();
                throw new HttpRequestException($"Request to pollen API failed: {reason}");
            }
            string responseBody = await response.Content.ReadAsStringAsync();

            // Deserialize
            List<PollenData> pollenData = JsonSerializer.Deserialize<List<PollenData>>(responseBody) ?? new List<PollenData>();

            // Attach locations to data
            for (int i = 0; i < pollenData.Count && i < locations.Count; i++)
            {
                pollenData[i].Location = locations[i];
            }

            _memoryCache.Set(cacheKey, pollenData, DateTimeOffset.Now.AddMinutes(60));

            return pollenData;
        }
        private PollenData ParseCurrentPollenData(string responseBody)
        {
            // When requesting the current data the data is organized slightly differently
            // Thats why this function is used to parse that
            var pollenData = JsonSerializer.Deserialize<PollenData>(responseBody);
            if (pollenData == null)
            {
                throw new HttpRequestException("Failed to deserialize PollenData from response.");
            }

            if (pollenData.Hourly == null)
            {
                pollenData.Hourly = new HourlyData();
            }

            var current = JsonSerializer.Deserialize<JsonElement>(responseBody).GetProperty("current");

            pollenData.Hourly.Time = new List<string> { current.GetProperty("time").GetString() ?? "" };

            var pollenTypes = new Dictionary<string, Action<double?>>
            {
                { "birch_pollen", value => pollenData.Hourly.BirchPollen = new List<double?> { value } },
                { "grass_pollen", value => pollenData.Hourly.GrassPollen = new List<double?> { value } },
                { "alder_pollen", value => pollenData.Hourly.AlderPollen = new List<double?> { value } },
                { "mugwort_pollen", value => pollenData.Hourly.MugwortPollen = new List<double?> { value } },
                { "olive_pollen", value => pollenData.Hourly.OlivePollen = new List<double?> { value } },
                { "ragweed_pollen", value => pollenData.Hourly.RagweedPollen = new List<double?> { value } }
            };

            foreach (var pollenType in pollenTypes)
            {
                if (current.TryGetProperty(pollenType.Key, out var pollenProperty) && pollenProperty.ValueKind == JsonValueKind.Number)
                {
                    pollenType.Value(pollenProperty.GetDouble());
                }
            }

            return pollenData;
        }
    }

    
}