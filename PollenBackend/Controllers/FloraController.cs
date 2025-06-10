using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PollenBackend.Data;
using PollenBackend.Models;

namespace PollenBackend.Controllers
{
    [ApiController]
    [Route("api/flora")]
    public class FloraController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FloraController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("list")]
        public async Task<ActionResult<IEnumerable<Flora>>> GetFloraList()
        {
            var floraList = await _context.Flora.ToListAsync();
            return Ok(floraList);
        }
    }
}
