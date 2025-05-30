using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using PollenBackend.Data;
using PollenBackend.Models;

namespace PollenBackend.Services
{
    public interface ILocationService
    {
        Task<IEnumerable<Location>> GetLocations();
        Task<IEnumerable<Location>> GetLocationsList();
        Task<IEnumerable<Location>> GetMunicipality();
    }

    public class LocationService : ILocationService
    {
        private readonly AppDbContext _dbContext;
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _memoryCache;

        public LocationService(AppDbContext dbContext, HttpClient httpClient, IMemoryCache memoryCache)
        {
            _dbContext = dbContext;
            _httpClient = httpClient;
            _memoryCache = memoryCache;
        }

        public async Task<IEnumerable<Location>> GetLocations()
        {
            return await _dbContext.Locations.ToListAsync();
        }

        public async Task<IEnumerable<Location>> GetMunicipality()
        {
            // Api docs: https://api.pdok.nl/kadaster/bestuurlijkegebieden/ogc/v1/api
            var baseUrl = "https://api.pdok.nl/kadaster/bestuurlijkegebieden/ogc/v1/collections/gemeentegebied/items";
            var query = "?limit=342&crs=http%3A%2F%2Fwww.opengis.net%2Fdef%2Fcrs%2FOGC%2F1.3%2FCRS84&bbox-crs=http%3A%2F%2Fwww.opengis.net%2Fdef%2Fcrs%2FOGC%2F1.3%2FCRS84";
            string fullUrl = baseUrl + query;

            HttpResponseMessage response = await _httpClient.GetAsync(fullUrl);

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine(
                    $"Location API request failed: {await response.Content.ReadAsStringAsync()}"
                );
                throw new HttpRequestException(
                    $"Request to Location API failed with status code {(int)response.StatusCode}"
                );
            }

            string responseBody = await response.Content.ReadAsStringAsync();
            var locations = ConvertGeoJsonToLocations(responseBody);

            return locations;
        }

        public static List<Location> ConvertGeoJsonToLocations(string geoJson)
        {
            // Api docs: https://api.pdok.nl/kadaster/bestuurlijkegebieden/ogc/v1/api
            using var doc = JsonDocument.Parse(geoJson);
            var root = doc.RootElement;

            var features = root.GetProperty("features");
            var locations = new List<Location>();

            foreach (var feature in features.EnumerateArray())
            {
                var id = feature.GetProperty("id").GetString();
                var properties = feature.GetProperty("properties");

                string name = properties.TryGetProperty("naam", out var naamProp)
                    ? naamProp.GetString() ?? $"Feature {id}"
                    : $"Feature {id}";

                var geometry = feature.GetProperty("geometry");
                var type = geometry.GetProperty("type").GetString();
                var coordinatesRoot = geometry.GetProperty("coordinates");

                var coordinates = new List<Coordinate>();

                if (type == "Polygon")
                {
                    var outerRing = coordinatesRoot[0];
                    foreach (var point in outerRing.EnumerateArray())
                    {
                        float lon = point[0].GetSingle();
                        float lat = point[1].GetSingle();
                        coordinates.Add(new Coordinate { Latitude = lat, Longitude = lon });
                    }
                }
                else if (type == "MultiPolygon")
                {
                    foreach (var polygon in coordinatesRoot.EnumerateArray())
                    {
                        var outerRing = polygon[0];
                        foreach (var point in outerRing.EnumerateArray())
                        {
                            float lon = point[0].GetSingle();
                            float lat = point[1].GetSingle();
                            coordinates.Add(new Coordinate { Latitude = lat, Longitude = lon });
                        }
                    }
                }
                else
                {
                    Console.WriteLine($"Skipping unsupported geometry type: {type}");
                    continue;
                }

                if (coordinates.Count == 0) continue;

                float maxLat = coordinates.Max(p => p.Latitude);
                float minLat = coordinates.Min(p => p.Latitude);
                float maxLon = coordinates.Max(p => p.Longitude);
                float minLon = coordinates.Min(p => p.Longitude);

                var location = new Location
                {
                    Name = name,
                    Latitude = (maxLat + minLat) / 2,
                    Longitude = (maxLon + minLon) / 2,
                    Coordinates = coordinates,
                };

                locations.Add(location);
            }

            return locations;
        }

        public async Task<IEnumerable<Location>> GetLocationsList()
        {
            const string cacheKey = "LocationsList";

            if (_memoryCache.TryGetValue(cacheKey, out List<Location>? cachedData))
            {
                return cachedData!;
            }

            var locations = await _dbContext.Locations
                .Select(location => new Location
                {
                    Id = location.Id,
                    Name = location.Name,
                    Latitude = location.Latitude,
                    Longitude = location.Longitude,
                    Coordinates = null!,
                })
                .ToListAsync();

            _memoryCache.Set(cacheKey, locations, DateTimeOffset.Now.AddMinutes(60));

            return locations;
        }
    }
}