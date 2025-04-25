using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using PollenBackend.Models;
using PollenBackend.Services;

namespace PollenBackend.Controllers
{
    [ApiController]
    [Route("api/pollen")]
    public class PollenController : ControllerBase
    {
        private readonly IPollenService _pollenService;
        private readonly IMemoryCache _memoryCache;
        public PollenController(IPollenService pollenService, IMemoryCache memoryCache)
        {
            _pollenService = pollenService;
            _memoryCache = memoryCache;
        }

        [HttpGet("location")]
        public async Task<ActionResult<PollenData>> GetByLocation([FromQuery] double latitude, [FromQuery] double longitude)
        {
            try
            {
                var cacheKey = $"PollenData-{latitude}-{longitude}";

                if (!_memoryCache.TryGetValue(cacheKey, out PollenData? cachedData))
                {
                    Console.Out.WriteLine("New request");
                    var pollenData = await _pollenService.GetCurrentPollenFromLocation(latitude, longitude);

                    var cacheOptions = new MemoryCacheEntryOptions()
                        .SetSlidingExpiration(TimeSpan.FromMinutes(60))
                        .SetAbsoluteExpiration(TimeSpan.FromMinutes(90));

                    _memoryCache.Set(cacheKey, pollenData, cacheOptions);

                    return Ok(pollenData);
                }
                else
                {
                    Console.Out.WriteLine("Cache hit");
                    return Ok(cachedData);
                }
            }
            catch (HttpRequestException e)
            {
                return StatusCode((int)(e.StatusCode ?? HttpStatusCode.ServiceUnavailable), new { error = e.Message });
            }
        }

        [HttpGet("map")]
        public async Task<ActionResult<List<PollenData>>> GetMap()
        {
            try{
                var pollenData = await _pollenService.GetPollenMap();
                return Ok(pollenData);
            }catch(HttpRequestException e){
                return StatusCode((int)(e.StatusCode ?? HttpStatusCode.ServiceUnavailable),new {error=e.Message});
            }
        }
    }

}
