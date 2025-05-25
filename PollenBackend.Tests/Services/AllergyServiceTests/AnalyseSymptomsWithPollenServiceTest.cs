using System.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using PollenBackend.Data;
using PollenBackend.Models;
using PollenBackend.Services;
using PollenBackend.Validation;

namespace PollenBackend.Tests.Services.AllergyServiceTests
{
    public class AnalyseSymptomsWithPollenServiceTest : MockApiCall
    {
        private readonly Mock<AppDbContext> _mockAppDbContext;
        private readonly Mock<ILocationService> _mockLocationService;
        private readonly IMemoryCache _memoryCache;
        private readonly HttpClient _httpClient;
        private readonly PollenService _pollenService;
        private readonly SymptomAnalysisService _service;

        public AnalyseSymptomsWithPollenServiceTest()
        {
            _mockHandler = new Mock<HttpMessageHandler>(); //From MockApiCall

            _mockAppDbContext = new Mock<AppDbContext>(new DbContextOptions<AppDbContext>());
            _mockLocationService = new Mock<ILocationService>();
            _memoryCache = new MemoryCache(new MemoryCacheOptions());
            _httpClient = new HttpClient(_mockHandler.Object);
            _pollenService = new PollenService(_mockAppDbContext.Object,_mockLocationService.Object,_httpClient, _memoryCache);
            _service = new SymptomAnalysisService(_pollenService);
        }

        [Fact]
        public async Task AnalyzeSymptoms_WithRealPollenService_ReturnsCorrectSuggestions()
        {
            // Arrange
            var requests = new List<PollenDataRequest>
            {
                new PollenDataRequest { Latitude = 52.1, Longitude = 5.1, Date = new DateTime(2025, 5, 10) },
                new PollenDataRequest { Latitude = 52.1, Longitude = 5.1, Date = new DateTime(2025, 5, 11) }
            };

            // Mock de API response met testdata
            mockApiCall("TestData", "PollenApiByDateAndCoordinates.json", HttpStatusCode.OK);

            // Tijdelijk datumvalidatie uitschakelen voor deze test
            PollenDataRequestValidator.SkipDateValidation = true;

            try
            {
                // Act - hier wordt de echte GetPollenDataForDatesAndCoordinates aangeroepen
                var result = await _service.AnalyzeSymptoms(requests);

                // Assert
                Assert.NotNull(result);
                Assert.IsType<List<AllergySuggestion>>(result);
                Assert.Equal(2, result.Count); // Verwacht 2 suggesties (zoals in je testdata)
                Assert.Contains(result, r => r.PollenType == "grass_pollen" && (int)Math.Ceiling(r.AverageConcentration) == 6);
                Assert.Contains(result, r => r.PollenType == "birch_pollen" && (int)Math.Ceiling(r.AverageConcentration) == 3);
            }
            finally
            {
                // Zorg ervoor dat we de oorspronkelijke staat herstellen
                PollenDataRequestValidator.SkipDateValidation = false;
            }
        }
    }
}