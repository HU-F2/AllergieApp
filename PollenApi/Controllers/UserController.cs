using Microsoft.AspNetCore.Mvc;
using PollenApi.Models;
using System.Collections.Generic;
using System.Linq;

namespace PollenApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        // Fake in-memory user list for demo purposes
        private static List<User> _users = new List<User>
        {
            new User { Username = "john_doe" },
            new User { Username = "jane_smith"}
        };

        [HttpGet]
        public ActionResult<IEnumerable<User>> Get()
        {
            return Ok(_users);
        }
    }
}
