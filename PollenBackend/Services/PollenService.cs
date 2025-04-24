using System.Collections;
using System.Text.Json;
using PollenBackend.Data;
using PollenBackend.Models;

namespace PollenBackend.Services
{
    public interface IPollenService
    {
        /// <summary>
        /// Retrieves the pollen map data for all municipalities.
        /// </summary>
        /// <returns>A collection of <see cref="PollenData"/> objects.</returns>
        /// <exception cref="HttpRequestException">Thrown when the API request fails.</exception>
        Task<IEnumerable<PollenData>> GetPollenMap();
    }


    public class PollenService : IPollenService
    {

        private readonly AppDbContext _dbContext;
        private readonly ILocationService _locationService;

        public PollenService(AppDbContext dbContext, ILocationService locationService)
        {
            _dbContext = dbContext;
            _locationService = locationService;
        }

        public async Task<IEnumerable<PollenData>> GetPollenMap()
        {
            // TODO: Get from database again instead of api call
            // var locations = await _locationService.GetLocations();
            var locations = (await _locationService.GetMunicipality()).ToList();
            
            string latitudesParam = string.Join(",", locations.Select(loc => loc.Latitude));
            string longitudesParam = string.Join(",", locations.Select(loc => loc.Longitude));

            string baseUrl = "https://air-quality-api.open-meteo.com/v1/air-quality";
            // TODO: Fix hardcoded start and enddate
            string query = $"?latitude={latitudesParam}&longitude={longitudesParam}&hourly=birch_pollen,grass_pollen&start_date=2025-04-22&end_date=2025-04-24";
            string fullUrl = baseUrl + query;
            
            // Make api request
            using HttpClient client = new HttpClient();
            HttpResponseMessage response = await client.GetAsync(fullUrl);

            if (!response.IsSuccessStatusCode)
            {
                throw new HttpRequestException($"Request to pollen api went wrong with status code {(int)response.StatusCode}");
            }
            string responseBody = await response.Content.ReadAsStringAsync();

            // Add location and pollen data together
            List<PollenData> data = JsonSerializer.Deserialize<List<PollenData>>(responseBody) ?? new List<PollenData>();
            for(int i = 0; i < data.Count; i++){
                data[i].Location = locations[i];
            }

            return data;
        }
    }
}