using Moq;
using PollenBackend.Models;
using PollenBackend.Services;

namespace PollenBackend.Tests.Services.AllergyServiceTests
{
    public class AnalyzeSymptomsTest : MockApiCall
    {
        private readonly Mock<IPollenService> _mockPollenService;
        private readonly SymptomAnalysisService _service;

        public AnalyzeSymptomsTest()
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
            Assert.IsType<List<AllergySuggestion>>(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, r => r.PollenType == "birch_pollen" && r.AverageConcentration == 25.0);
        }

        [Fact]
        public async Task AnalyzeSymptoms_ReturnsTopSuggestions2()
        {
            // Arrange
            var requests = new List<PollenDataRequest>
            {
                new PollenDataRequest { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 10) },
                new PollenDataRequest { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 11) }
            };

            var mockData = new List<PollenDataPoint>
            {
                new PollenDataPoint { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 10), BirchPollen = 20.0, GrassPollen = 5.0, AlderPollen = 12.0, MugwortPollen = 4.0, OlivePollen = 0.0 },
                new PollenDataPoint { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 11), BirchPollen = 30.0, GrassPollen = 10.0, AlderPollen = 12.0, MugwortPollen = 14.0, OlivePollen = 0.0 }
            };

            _mockPollenService.Setup(p => p.GetPollenDataForDatesAndCoordinates(requests)).ReturnsAsync(mockData);

            // Act
            var result = await _service.AnalyzeSymptoms(requests);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<List<AllergySuggestion>>(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, r => r.PollenType == "birch_pollen" && r.AverageConcentration == 25.0);
            Assert.Contains(result, r => r.PollenType == "alder_pollen" && r.AverageConcentration == 12.0);
        }

        [Fact]
        public async Task AnalyzeSymptoms_GapDate_ReturnsTopSuggestions()
        {
            // Arrange
            var requests = new List<PollenDataRequest>
            {
                new PollenDataRequest { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 10) },
                new PollenDataRequest { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 12) }
            };

            var mockData = new List<PollenDataPoint>
            {
                new PollenDataPoint { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 10), BirchPollen = 20.0, GrassPollen = 5.0, AlderPollen = 12.0, MugwortPollen = 4.0, OlivePollen = 0.0 },
                new PollenDataPoint { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 11), BirchPollen = 30.0, GrassPollen = 100.0, AlderPollen = 120.0, MugwortPollen = 14.0, OlivePollen = 0.0 },
                new PollenDataPoint { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 12), BirchPollen = 30.0, GrassPollen = 10.0, AlderPollen = 12.0, MugwortPollen = 14.0, OlivePollen = 0.0 },
            };

            _mockPollenService.Setup(p => p.GetPollenDataForDatesAndCoordinates(requests)).ReturnsAsync(mockData);

            // Act
            var result = await _service.AnalyzeSymptoms(requests);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<List<AllergySuggestion>>(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, r => r.PollenType == "birch_pollen" && r.AverageConcentration == 25.0);
            Assert.Contains(result, r => r.PollenType == "alder_pollen" && r.AverageConcentration == 12.0);
        }

        [Fact]
        public async Task AnalyzeSymptoms_BigGapDate_ReturnsTopSuggestions()
        {
            // Arrange
            var requests = new List<PollenDataRequest>
            {
                new PollenDataRequest { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 8) },
                new PollenDataRequest { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 13) }
            };

            var mockData = new List<PollenDataPoint>
            {
                new PollenDataPoint { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 8), BirchPollen = 15.0, GrassPollen = 8.0, AlderPollen = 10.0, MugwortPollen = 2.0, OlivePollen = 1.0 },
                new PollenDataPoint { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 9), BirchPollen = 18.0, GrassPollen = 6.0, AlderPollen = 11.0, MugwortPollen = 3.0, OlivePollen = 0.5 },
                new PollenDataPoint { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 10), BirchPollen = 22.0, GrassPollen = 7.0, AlderPollen = 9.0, MugwortPollen = 1.5, OlivePollen = 0.0 },
                new PollenDataPoint { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 11), BirchPollen = 17.0, GrassPollen = 9.0, AlderPollen = 13.0, MugwortPollen = 2.5, OlivePollen = 0.2 },
                new PollenDataPoint { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 12), BirchPollen = 19.0, GrassPollen = 5.5, AlderPollen = 12.5, MugwortPollen = 3.5, OlivePollen = 0.8 },
                new PollenDataPoint { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 13), BirchPollen = 21.0, GrassPollen = 4.0, AlderPollen = 14.0, MugwortPollen = 1.0, OlivePollen = 0.3 }
            };

            _mockPollenService.Setup(p => p.GetPollenDataForDatesAndCoordinates(requests)).ReturnsAsync(mockData);

            // Act
            var result = await _service.AnalyzeSymptoms(requests);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<List<AllergySuggestion>>(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, r => r.PollenType == "birch_pollen" && r.AverageConcentration == 18.0);
            Assert.Contains(result, r => r.PollenType == "alder_pollen" && r.AverageConcentration == 12.0);
        }
    }
}