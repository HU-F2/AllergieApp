using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using PollenBackend.Models;
using PollenBackend.Services;

namespace PollenBackend.Controllers
{
    [ApiController]
    [Route("api/weather")]
    public class WeatherController : ControllerBase
    {
        private readonly IWeatherService _weatherService;
        private readonly IMemoryCache _memoryCache;

        public WeatherController(IWeatherService WeatherService, IMemoryCache memoryCache)
        {
            _weatherService = WeatherService;
            _memoryCache = memoryCache;
        }

        [HttpGet("forecast")]
        public async Task<ActionResult<WeatherData>> GetThreeHourForecast([FromQuery] double latitude, [FromQuery] double longitude)
        {
            try
            {
                var cacheKey = $"WeatherData-{latitude}-{longitude}";
                if (!_memoryCache.TryGetValue(cacheKey, out WeatherData? cachedData))
                {
                    Console.Out.WriteLine("New weather request");
                    var weatherData = await _weatherService.GetThreeHourForecast(latitude, longitude);

                    var cacheOptions = new MemoryCacheEntryOptions()
                        .SetSlidingExpiration(TimeSpan.FromMinutes(30))
                        .SetAbsoluteExpiration(TimeSpan.FromMinutes(60));

                    _memoryCache.Set(cacheKey, weatherData, cacheOptions);

                    return Ok(weatherData);
                }
                else
                {
                    Console.Out.WriteLine("Weather cache hit");
                    return Ok(cachedData);
                }
            }
            catch (HttpRequestException e)
            {
                return StatusCode((int)(e.StatusCode ?? HttpStatusCode.ServiceUnavailable), new { error = e.Message });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { error = e.Message });
            }
        }
    }
}
