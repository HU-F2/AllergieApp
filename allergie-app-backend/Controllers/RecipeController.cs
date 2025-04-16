using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using AllergieAppBackend.DTOs;
using AllergieAppBackend.Services;
using AutoMapper;

namespace AllergieAppBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipeController : ControllerBase
    {
        private readonly IRecipeService _service;
        private readonly IMapper _mapper;

        public RecipeController(IRecipeService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet("filter")]
        public async Task<ActionResult<List<RecipeDto>>> GetFiltered([FromQuery] List<string> excludeAllergens)
        {
            var recipes = await _service.GetFilteredRecipesAsync(excludeAllergens);
            return Ok(_mapper.Map<List<RecipeDto>>(recipes));
        }
    }
}