using Microsoft.AspNetCore.Mvc;

namespace AllergieAppBackend.Controllers
{
	[ApiController]
	[Route("api/test")]
	public class TestController : ControllerBase
	{
		[HttpGet]
		public IActionResult Get()
		{
			return Ok("API werkt!");
		}
	}
}