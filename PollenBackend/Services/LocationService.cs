using System.Text.Json;
using Microsoft.AspNetCore.DataProtection.Repositories;
using Microsoft.EntityFrameworkCore;
using PollenBackend.Data;
using PollenBackend.Models;

namespace PollenBackend.Services
{
    public interface ILocationService
    {
        Task<IEnumerable<Location>> GetLocations();
        Task<IEnumerable<Location>> GetMunicipality();
    }


    public class LocationService : ILocationService
    {

        private readonly AppDbContext _dbContext;

        public LocationService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Location>> GetLocations()
        {
            return await _dbContext.Locations.ToListAsync();
        }

        public async Task<IEnumerable<Location>> GetMunicipality()
        {
            var baseUrl = "https://api.pdok.nl/kadaster/bestuurlijkegebieden/ogc/v1/collections/gemeentegebied/items";
            var query = "?limit=342&crs=http%3A%2F%2Fwww.opengis.net%2Fdef%2Fcrs%2FOGC%2F1.3%2FCRS84&bbox-crs=http%3A%2F%2Fwww.opengis.net%2Fdef%2Fcrs%2FOGC%2F1.3%2FCRS84";
            string fullUrl = baseUrl + query;
            
            using HttpClient client = new HttpClient();

            HttpResponseMessage response = await client.GetAsync(fullUrl);
            
            if (!response.IsSuccessStatusCode)
            {
                // Failed
            }
            

            string responseBody = await response.Content.ReadAsStringAsync(); 
            var locations = ConvertGeoJsonToLocations(responseBody);
            // foreach(var location in locations){
            //     Console.Out.WriteLine("Name: " + location.Name);
            //     Console.Out.WriteLine("Coordinate count: " + location.Coordinates.Count);
            //     Console.Out.WriteLine("Longitude: " + location.Longitude);
            //     Console.Out.WriteLine("Latitude: " + location.Latitude);
            // }
            
            return locations;
        }

        public static List<Location> ConvertGeoJsonToLocations(string geoJson)
        {
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
                    var outerRing = coordinatesRoot[0]; // first ring
                    foreach (var point in outerRing.EnumerateArray())
                    {
                        float lon = point[0].GetSingle();
                        float lat = point[1].GetSingle();
                        coordinates.Add(new Coordinate { Latitude = lat, Longitude = lon });
                    }
                }
                else if (type == "MultiPolygon")
                {
                    foreach (var polygon in coordinatesRoot.EnumerateArray()) // each polygon
                    {
                        var outerRing = polygon[0]; // outer ring
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
                    Latitude = (maxLat+minLat)/2,
                    Longitude = (maxLon+minLon)/2,
                    Coordinates = coordinates
                };

                locations.Add(location);
            }

            return locations;
        }

    }
}