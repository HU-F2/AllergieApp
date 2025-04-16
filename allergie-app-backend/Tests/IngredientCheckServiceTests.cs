using AllergieAppBackend.Services;
using Xunit;

namespace AllergieAppBackend.Tests
{
    public class IngredientCheckServiceTests
    {
        [Fact]
        public void ShouldDetectKnownAllergens()
        {
            var service = new IngredientCheckService();
            var result = service.Check(new List<string> { "gluten", "rijst", "noten" });

            Assert.Contains("gluten", result.DetectedAllergens);
            Assert.Contains("noten", result.DetectedAllergens);
            Assert.DoesNotContain("rijst", result.DetectedAllergens);
        }
    }
}