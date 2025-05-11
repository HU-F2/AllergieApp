using Moq;
using PollenBackend.Models;
using PollenBackend.Services;

namespace PollenBackend.Tests.Services.AllergyServiceTests
{
    public class AnalyzeSymptomsTest
    {
        private readonly Mock<IPollenService> _mockPollenService;
        private readonly SymptomAnalysisService _allergyService;

        public AnalyzeSymptomsTest()
        {
            _mockPollenService = new Mock<IPollenService>();
            _allergyService = new SymptomAnalysisService(_mockPollenService.Object);
        }

        [Fact]
        public async Task AnalyzeSymptoms_SingleDate_ReturnsExpectedSuggestion1()
        {
            // Arrange
            var submission = new SymptomSubmission
            {
                Latitude = 52.0,
                Longitude = 5.0,
                SymptomDates = new List<DateTime> { DateTime.Today }
            };

            var mockPollenData = new List<PollenData>
            {
                new PollenData
                {
                    Location = new Location { Latitude = 52.0F, Longitude = 5.0F },
                    Hourly = new HourlyData
                    {
                        Time = new List<string> { DateTime.Today.ToString("yyyy-MM-ddTHH:mm") },
                        BirchPollen = new List<double?> { 25.0 },
                        GrassPollen = new List<double?> { 10.0 },
                        AlderPollen = new List<double?> { 5.0 },
                        MugwortPollen = new List<double?> { 0.0 },
                        OlivePollen = new List<double?> { null },
                        RagweedPollen = new List<double?> { 2.0 }
                    }
                }
            };

            _mockPollenService.Setup(s => s.GetPollenMap()).ReturnsAsync(mockPollenData);

            // Act
            var result = await _allergyService.AnalyzeSymptoms(submission);

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Contains(result, r => r.PollenType == "birch_pollen" && r.AverageConcentration > 0);
        }


        [Fact]
        public async Task AnalyzeSymptoms_SingleDate_ReturnsExpectedSuggestion2()
        {
            // Arrange
            var submission = new SymptomSubmission
            {
                Latitude = 52.0,
                Longitude = 5.0,
                SymptomDates = new List<DateTime> { DateTime.Today }
            };

            var mockPollenData = new List<PollenData>
            {
                new PollenData
                {
                    Location = new Location { Latitude = 52.0F, Longitude = 5.0F },
                    Hourly = new HourlyData
                    {
                        Time = new List<string> { DateTime.Today.ToString("yyyy-MM-ddTHH:mm") },
                        BirchPollen = new List<double?> { 20.0 },
                        GrassPollen = new List<double?> { 5.0 }
                    }
                }
            };

            _mockPollenService.Setup(s => s.GetPollenMap()).ReturnsAsync(mockPollenData);

            // Act
            var result = await _allergyService.AnalyzeSymptoms(submission);

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Contains(result, r => r.PollenType == "birch_pollen" && r.AverageConcentration == 20.0);
        }

        [Fact]
        public async Task AnalyzeSymptoms_MultipleDates_CalculatesAverageCorrectly()
        {
            // Arrange
            var dates = new List<DateTime> { DateTime.Today, DateTime.Today.AddDays(-1) };

            var submission = new SymptomSubmission
            {
                Latitude = 52.0,
                Longitude = 5.0,
                SymptomDates = dates
            };

            var mockPollenData = new List<PollenData>
            {
                new PollenData
                {
                    Location = new Location { Latitude = 52.0F, Longitude = 5.0F },
                    Hourly = new HourlyData
                    {
                        Time = dates.Select(d => d.ToString("yyyy-MM-ddTHH:mm")).ToList(),
                        BirchPollen = new List<double?> { 20.0, 30.0 }, // Average = 25.0
                        GrassPollen = new List<double?> { 10.0, null }  // Average = 10.0
                    }
                }
            };

            _mockPollenService.Setup(s => s.GetPollenMap()).ReturnsAsync(mockPollenData);

            // Act
            var result = await _allergyService.AnalyzeSymptoms(submission);

            // Assert
            var birch = result.FirstOrDefault(r => r.PollenType == "birch_pollen");
            Assert.NotNull(birch);
            Assert.Equal(25.0, birch!.AverageConcentration, 1);

            var grass = result.FirstOrDefault(r => r.PollenType == "grass_pollen");
            Assert.NotNull(grass);
            Assert.Equal(10.0, grass!.AverageConcentration, 1);
        }

        [Fact]
        public async Task AnalyzeSymptoms_PollenValuesNullAndZero_HandledCorrectly()
        {
            // Arrange
            var date = DateTime.Today;

            var submission = new SymptomSubmission
            {
                Latitude = 52.0,
                Longitude = 5.0,
                SymptomDates = new List<DateTime> { date }
            };

            var mockPollenData = new List<PollenData>
            {
                new PollenData
                {
                    Location = new Location { Latitude = 52.0F, Longitude = 5.0F },
                    Hourly = new HourlyData
                    {
                        Time = new List<string> { date.ToString("yyyy-MM-ddTHH:mm") },
                        BirchPollen = new List<double?> { null },
                        GrassPollen = new List<double?> { 0.0 }
                    }
                }
            };

            _mockPollenService.Setup(s => s.GetPollenMap()).ReturnsAsync(mockPollenData);

            // Act
            var result = await _allergyService.AnalyzeSymptoms(submission);

            // Assert
            Assert.Single(result);
            Assert.Equal("grass_pollen", result[0].PollenType);
            Assert.Equal(0.0, result[0].AverageConcentration);
        }

        [Fact]
        public async Task AnalyzeSymptoms_DateWithoutData_ReturnsNoSuggestions()
        {
            // Arrange
            var submission = new SymptomSubmission
            {
                Latitude = 52.0,
                Longitude = 5.0,
                SymptomDates = new List<DateTime> { DateTime.Today }
            };

            var mockPollenData = new List<PollenData>
            {
                new PollenData
                {
                    Location = new Location { Latitude = 52.0F, Longitude = 5.0F },
                    Hourly = new HourlyData
                    {
                        Time = new List<string> { DateTime.Today.AddDays(-1).ToString("yyyy-MM-ddTHH:mm") }, // andere dag
                        BirchPollen = new List<double?> { 10.0 }
                    }
                }
            };

            _mockPollenService.Setup(s => s.GetPollenMap()).ReturnsAsync(mockPollenData);

            // Act
            var result = await _allergyService.AnalyzeSymptoms(submission);

            // Assert
            Assert.Empty(result);
        }
    }
}