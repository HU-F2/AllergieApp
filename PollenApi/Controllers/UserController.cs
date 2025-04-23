using Microsoft.AspNetCore.Mvc;
using PollenApi.Models;
using PollenApi.Services;
using System.Collections.Generic;
using System.Linq;

namespace PollenApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<List<User>>> Get()
        {
            var users = await _userService.GetUsers();
            return Ok(users);
        }
    }
}
