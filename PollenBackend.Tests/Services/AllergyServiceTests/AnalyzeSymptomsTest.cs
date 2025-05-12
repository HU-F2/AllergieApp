using Moq;
using PollenBackend.Services;

namespace PollenBackend.Tests.Services.AllergyServiceTests
{
    public class AnalyzeSymptomsUpdatedTest
    {
        private readonly Mock<IPollenService> _mockPollenService;
        private readonly SymptomAnalysisService _service;

        public AnalyzeSymptomsUpdatedTest()
        {
            _mockPollenService = new Mock<IPollenService>();
            _service = new SymptomAnalysisService(_mockPollenService.Object);
        }

        [Fact]
        public async Task AnalyzeSymptoms_ReturnsTopSuggestions()
        {
            // Arrange
            var requests = new List<PollenDataRequest>
            {
                new PollenDataRequest { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 10) },
                new PollenDataRequest { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 11) }
            };

            var mockData = new List<PollenDataPoint>
            {
                new PollenDataPoint { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 10), BirchPollen = 20.0, GrassPollen = 5.0 },
                new PollenDataPoint { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 11), BirchPollen = 30.0, GrassPollen = 10.0 }
            };

            _mockPollenService.Setup(p => p.GetPollenDataForDatesAndCoordinates(requests)).ReturnsAsync(mockData);

            // Act
            var result = await _service.AnalyzeSymptoms(requests);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, r => r.PollenType == "birch_pollen" && r.AverageConcentration == 25.0);
        }
    }
}