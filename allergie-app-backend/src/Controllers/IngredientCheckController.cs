using Microsoft.AspNetCore.Mvc;
using AllergieAppBackend.Models;
using AllergieAppBackend.Services;

namespace AllergieAppBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IngredientCheckController : ControllerBase
    {
        private readonly IIngredientCheckService _checkService;

        public IngredientCheckController(IIngredientCheckService checkService)
        {
            _checkService = checkService;
        }

        [HttpPost("check")]
        public IActionResult CheckIngredients([FromBody] IngredientCheckRequest request)
        {
            var result = _checkService.Check(request.Ingredients);
            return Ok(result);
        }
    }
}