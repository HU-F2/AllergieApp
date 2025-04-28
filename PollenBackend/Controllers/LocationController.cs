using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using PollenBackend.Models;
using PollenBackend.Services;

namespace PollenBackend.Controllers
{
    [ApiController]
    [Route("api/locations")]
    public class LocationController : ControllerBase
    {
        private readonly ILocationService _locationService;
        private readonly IMemoryCache _memoryCache;
        public LocationController(ILocationService locationService, IMemoryCache memoryCache)
        {
            _locationService = locationService;
            _memoryCache = memoryCache;
        }

        [HttpGet("list")]
        public async Task<ActionResult<Location>> GetLocationsList()
        {
            var locations = await _locationService.GetLocationsList();

            return Ok(locations);
        }
    }

}
