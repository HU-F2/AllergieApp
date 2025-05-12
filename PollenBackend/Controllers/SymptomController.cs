using Microsoft.AspNetCore.Mvc;
using PollenBackend.Models;
using PollenBackend.Services;

namespace PollenBackend.Controllers
{
    [ApiController]
    [Route("api/AllergySuggestion")]
    public class SymptomController : ControllerBase
    {
        private readonly ISymptomAnalysisService _analysisService;

        public SymptomController(ISymptomAnalysisService analysisService)
        {
            _analysisService = analysisService;
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> AnalyzeSymptoms([FromBody] List<PollenDataRequest> submission)
        {
            var suggestions = await _analysisService.AnalyzeSymptoms(submission);

            return Ok(
                new
                {
                    Disclaimer = "Let op: dit is geen medisch advies. Raadpleeg een arts bij ernstige klachten.",
                    Suggestions = suggestions,
                }
            );
        }
    }
}
