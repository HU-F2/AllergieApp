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
            const string cacheKey = "LocationsList";
        
            if (!_memoryCache.TryGetValue(cacheKey, out List<Location>? locations))
            {
                locations = (await _locationService.GetLocationsList()).ToList();
                
                _memoryCache.Set(cacheKey, locations, new MemoryCacheEntryOptions
                {
                    AbsoluteExpiration = DateTimeOffset.MaxValue
                });
            }

            return Ok(locations);
        }
    }

}
