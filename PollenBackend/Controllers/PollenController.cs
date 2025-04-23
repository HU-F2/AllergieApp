using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using PollenBackend.Models;
using PollenBackend.Services;

namespace PollenBackend.Controllers
{
    [ApiController]
    [Route("api/pollen")]
    public class PollenController : ControllerBase
    {
        private readonly ILocationService _locationService;
        public PollenController(ILocationService locationService)
        {
            _locationService = locationService;
        }

        [HttpGet("border")]
        public async Task<ActionResult<List<Location>>> GetStuff()
        {
            var test = await _locationService.GetMunicipality();
            return Ok(test);
        }

        [HttpGet("map")]
        public async Task<ActionResult<List<PollenData>>> Get()
        {
            // Lijst met 12 lat,lon
            // var locations = await _locationService.GetLocations();
            var locations = (await _locationService.GetMunicipality()).ToList();
            
            string latitudesParam = string.Join(",", locations.Select(loc => loc.Latitude));
            string longitudesParam = string.Join(",", locations.Select(loc => loc.Longitude));

            // Maak request 
            
            // https://air-quality-api.open-meteo.com/v1/air-quality?latitude=52.52&longitude=13.41&hourly=birch_pollen,grass_pollen&start_date=2025-04-22&end_date=2025-04-24
            string baseUrl = "https://air-quality-api.open-meteo.com/v1/air-quality";
            // TODO: Fix hardcoded start and enddate
            string query = $"?latitude={latitudesParam}&longitude={longitudesParam}&hourly=birch_pollen,grass_pollen&start_date=2025-04-22&end_date=2025-04-24";
            string fullUrl = baseUrl + query;
            
            using HttpClient client = new HttpClient();

            HttpResponseMessage response = await client.GetAsync(fullUrl);
            
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Failed to fetch air quality data");
            }

            string responseBody = await response.Content.ReadAsStringAsync();

            List<PollenData> data = JsonSerializer.Deserialize<List<PollenData>>(responseBody);
            for(int i = 0; i < data.Count; i++){
                data[i].Location = locations[i];
            }
            // Return the raw JSON response
            return Ok(data);
        }
    }

}
