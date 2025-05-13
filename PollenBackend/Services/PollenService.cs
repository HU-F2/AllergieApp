using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;
using PollenBackend.Data;
using PollenBackend.Models;
using System.Globalization;

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

        Task<List<PollenDataPoint>> GetPollenDataForDatesAndCoordinates(List<PollenDataRequest> requests);
    }

    public class PollenService : IPollenService
    {
        private readonly AppDbContext _dbContext;
        private readonly ILocationService _locationService;
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _memoryCache;
        // Pollen types that get requested
        private static string POLLEN_TYPES = "alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen";

        public PollenService(AppDbContext dbContext, ILocationService locationService, HttpClient httpClient, IMemoryCache memoryCache)
        {
            _dbContext = dbContext;
            _locationService = locationService;
            _httpClient = httpClient;
            _memoryCache = memoryCache;
        }

        public async Task<PollenData> GetCurrentPollenFromLocation(double latitude, double longitude)
        {
            var cacheKey = $"PollenData-{latitude.ToString(CultureInfo.InvariantCulture)}-{longitude.ToString(CultureInfo.InvariantCulture)}";

            if (_memoryCache.TryGetValue(cacheKey, out PollenData? cachedData))
            {
                return cachedData!;
            }

            string baseUrl = "https://air-quality-api.open-meteo.com/v1/air-quality";
            string query = $"?latitude={latitude.ToString(CultureInfo.InvariantCulture)}&longitude={longitude.ToString(CultureInfo.InvariantCulture)}&current={POLLEN_TYPES}&timezone=Europe%2FBerlin";
            string fullUrl = baseUrl + query;

            // Make API request
            HttpResponseMessage response = await _httpClient.GetAsync(fullUrl);
            string responseBody = await response.Content.ReadAsStringAsync();

            EnsureSuccessStatusCode(responseBody, response.IsSuccessStatusCode);

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
            string latitudesParam = string.Join(",", locations.Select(loc => loc.Latitude.ToString(CultureInfo.InvariantCulture)));
            string longitudesParam = string.Join(",", locations.Select(loc => loc.Longitude.ToString(CultureInfo.InvariantCulture)));

            // Build URL
            string baseUrl = "https://air-quality-api.open-meteo.com/v1/air-quality";
            string startDate = DateTime.UtcNow.ToString("yyyy-MM-dd");
            string endDate = DateTime.UtcNow.AddDays(2).ToString("yyyy-MM-dd");
            string query = $"?latitude={latitudesParam}&longitude={longitudesParam}&hourly={POLLEN_TYPES}&start_date={startDate}&end_date={endDate}";
            string fullUrl = baseUrl + query;

            // Make API request
            HttpResponseMessage response = await _httpClient.GetAsync(fullUrl);
            string responseBody = await response.Content.ReadAsStringAsync();

            EnsureSuccessStatusCode(responseBody, response.IsSuccessStatusCode);

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

        public async Task<List<PollenDataPoint>> GetPollenDataForDatesAndCoordinates(List<PollenDataRequest> requests)
        {
            var result = new List<PollenDataPoint>();

            // Groepeer op coördinaten om dubbele API-calls te voorkomen
            var groupedRequests = requests
                .GroupBy(r => (r.Latitude, r.Longitude))
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(r => r.Date.Date).Distinct().ToList()
                );

            foreach (var entry in groupedRequests)
            {
                var (latitude, longitude) = entry.Key;
                var requestedDates = entry.Value;

                // Bepaal welke datums nog niet in de cache zitten
                var uncachedDates = new List<DateTime>();

                foreach (var date in requestedDates)
                {
                    string cacheKey = $"PollenDataPoint-{latitude.ToString(CultureInfo.InvariantCulture)}-{longitude.ToString(CultureInfo.InvariantCulture)}-{date:yyyy-MM-dd}";

                    if (_memoryCache.TryGetValue(cacheKey, out List<PollenDataPoint>? cachedData) && cachedData != null)
                    {
                        result.AddRange(cachedData);
                    }
                    else
                    {
                        uncachedDates.Add(date);
                    }
                }

                if (uncachedDates.Any())
                {
                    // Haal ontbrekende datums op in één API-call
                    string baseUrl = "https://air-quality-api.open-meteo.com/v1/air-quality";
                    string startDate = uncachedDates.Min().ToString("yyyy-MM-dd");
                    string endDate = uncachedDates.Max().ToString("yyyy-MM-dd");

                    string query = $"?latitude={latitude.ToString(CultureInfo.InvariantCulture)}&longitude={longitude.ToString(CultureInfo.InvariantCulture)}&hourly={POLLEN_TYPES}&start_date={startDate}&end_date={endDate}&timezone=Europe%2FBerlin";
                    string fullUrl = baseUrl + query;

                    HttpResponseMessage response = await _httpClient.GetAsync(fullUrl);
                    string responseBody = await response.Content.ReadAsStringAsync();

                    EnsureSuccessStatusCode(responseBody, response.IsSuccessStatusCode);

                    List<PollenData> pollenRawData = ParsePollenData(responseBody) ?? new List<PollenData>();
                    List<PollenDataPoint> dataPoints = ConvertToPollenDataPoints(pollenRawData);

                    // Groepeer per datum, sla afzonderlijk op in de cache
                    var groupedByDate = dataPoints.GroupBy(p => p.Date.Date);
                    foreach (var group in groupedByDate)
                    {
                        string cacheKey = $"PollenDataPoint-{latitude.ToString(CultureInfo.InvariantCulture)}-{longitude.ToString(CultureInfo.InvariantCulture)}-{group.Key:yyyy-MM-dd}";
                        List<PollenDataPoint> dayData = group.ToList();

                        _memoryCache.Set(cacheKey, dayData, DateTimeOffset.Now.AddMinutes(30));
                        result.AddRange(dayData);
                    }
                }
            }

            return result;
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

        public static List<PollenDataPoint> ConvertToPollenDataPoints(List<PollenData> pollenDataList)
        {
            return pollenDataList
                ?.Where(p => p?.Hourly?.Time != null)
                .SelectMany(p => p!.Hourly!.Time!
                    .Select((time, i) =>
                    {
                        if (!DateTime.TryParse(time, out DateTime timestamp))
                        {
                            return null;
                        }

                        return new PollenDataPoint
                        {
                            Date = timestamp,
                            Latitude = p.Latitude,
                            Longitude = p.Longitude,
                            BirchPollen = GetSafePollenValue(p.Hourly.BirchPollen, i),
                            GrassPollen = GetSafePollenValue(p.Hourly.GrassPollen, i),
                            AlderPollen = GetSafePollenValue(p.Hourly.AlderPollen, i),
                            MugwortPollen = GetSafePollenValue(p.Hourly.MugwortPollen, i),
                            OlivePollen = GetSafePollenValue(p.Hourly.OlivePollen, i),
                            RagweedPollen = GetSafePollenValue(p.Hourly.RagweedPollen, i)
                        };
                    })
                    .Where(p => p != null)
                    .Select(p => p!)) // Null-forgiving operator hier
                .ToList() ?? new List<PollenDataPoint>();
        }

        private static double? GetSafePollenValue(List<double?>? pollenList, int index)
        {
            return (index >= 0 && pollenList != null && index < pollenList.Count) ? pollenList[index] : null;
        }

        private void EnsureSuccessStatusCode(string responseContent, Boolean IsSuccessStatusCode)
        {
            if (!IsSuccessStatusCode)
            {
                string errorReason = "Unknown Reason";

                try
                {
                    var jsonDoc = JsonDocument.Parse(responseContent);
                    if (jsonDoc.RootElement.TryGetProperty("reason", out JsonElement reasonProp))
                    {
                        errorReason = reasonProp.GetString() ?? errorReason;
                    }
                }
                catch (JsonException)
                {
                    // Als JSON parsing faalt, gebruik dan de raw content
                    errorReason = responseContent.Length > 200
                        ? responseContent.Substring(0, 200) + "..."
                        : responseContent;
                }

                throw new HttpRequestException($"Request to pollen API failed: {errorReason}");
            }
        }

        private List<PollenData> ParsePollenData(string responseBody)
        {
            using var doc = JsonDocument.Parse(responseBody);

            return doc.RootElement.ValueKind == JsonValueKind.Array
                ? doc.RootElement.EnumerateArray()
                               .Select(x => x.Deserialize<PollenData>()!)
                               .ToList()
                : new List<PollenData> { doc.RootElement.Deserialize<PollenData>()! };
        }
    }
}