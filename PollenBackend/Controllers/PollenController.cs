using System.Net;
using Microsoft.AspNetCore.Mvc;
using PollenBackend.Models;
using PollenBackend.Services;

namespace PollenBackend.Controllers
{
    [ApiController]
    [Route("api/pollen")]
    public class PollenController : ControllerBase
    {
        private readonly IPollenService _pollenService;

        public PollenController(IPollenService pollenService)
        {
            _pollenService = pollenService;
        }

        [HttpGet("location")]
        public async Task<ActionResult<PollenData>> GetByLocation(
            [FromQuery] double latitude,
            [FromQuery] double longitude
        )
        {
            try
            {
                var pollenData = await _pollenService.GetCurrentPollenFromLocation(
                    latitude,
                    longitude
                );
                return Ok(pollenData);
            }
            catch (HttpRequestException e)
            {
                return StatusCode(
                    (int)(e.StatusCode ?? HttpStatusCode.ServiceUnavailable),
                    new { error = e.Message }
                );
            }
        }

        [HttpGet("map")]
        public async Task<ActionResult<List<PollenData>>> GetMap()
        {
            try
            {
                var pollenData = await _pollenService.GetPollenMap();
                return Ok(pollenData);
            }
            catch (HttpRequestException e)
            {
                return StatusCode(
                    (int)(e.StatusCode ?? HttpStatusCode.ServiceUnavailable),
                    new { error = e.Message }
                );
            }
        }
    }
}
