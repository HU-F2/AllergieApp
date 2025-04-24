using System.Net;
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
        private readonly IPollenService _pollenService;
        public PollenController(ILocationService locationService, IPollenService pollenService)
        {
            _locationService = locationService;
            _pollenService = pollenService;
        }

        [HttpGet("map")]
        public async Task<ActionResult<List<PollenData>>> Get()
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
