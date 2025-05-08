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
        public LocationController(ILocationService locationService)
        {
            _locationService = locationService;
        }

        [HttpGet("list")]
        public async Task<ActionResult<Location>> GetLocationsList()
        {
            var locations = (await _locationService.GetLocationsList()).ToList();
            return Ok(locations);
        }
    }

}
