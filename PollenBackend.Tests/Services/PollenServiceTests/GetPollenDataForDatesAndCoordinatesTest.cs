using System.Globalization;
using System.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using PollenBackend.Data;
using PollenBackend.Models;
using PollenBackend.Services;
using PollenBackend.Validation;

namespace PollenBackend.Tests.Services.PollenServiceTests
{
    public class GetPollenDataForDatesAndCoordinatesTest : MockApiCall
    {
        private readonly PollenService _pollenService;
        private readonly IMemoryCache _memoryCache;

        public GetPollenDataForDatesAndCoordinatesTest()
        {
            _mockHandler = new Mock<HttpMessageHandler>();
            var dbContext = new Mock<AppDbContext>(new DbContextOptions<AppDbContext>());
            var locationService = new Mock<ILocationService>();

            _memoryCache = new MemoryCache(new MemoryCacheOptions());
            var httpClient = new HttpClient(_mockHandler.Object);
            _pollenService = new PollenService(dbContext.Object, locationService.Object, httpClient, _memoryCache);
        }

        [Fact]
        public async Task GetPollenDataForDatesAndCoordinates_ReturnsExpectedData()
        {
            // Arrange
            var requests = new List<PollenDataRequest>
            {
                new PollenDataRequest { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 10) },
                new PollenDataRequest { Latitude = 52.0, Longitude = 5.0, Date = new DateTime(2024, 5, 11) }
            };

            mockApiCall("TestData", "PollenApiByDateAndCoordinates.json", HttpStatusCode.OK);

            // Tijdelijk datumvalidatie uitschakelen voor deze test
            PollenDataRequestValidator.SkipDateValidation = true;

            try
            {
                // Act
                var result = await _pollenService.GetPollenDataForDatesAndCoordinates(requests);

                // Assert
                Assert.NotNull(result);
                Assert.IsType<List<PollenDataPoint>>(result);
                Assert.Equal(48, result.Count);
                Assert.Contains(result, r => r.BirchPollen == 0.5);
                Assert.Contains(result, r => r.BirchPollen == 0.6);
            }
            finally
            {
                // Zorg ervoor dat we de oorspronkelijke staat herstellen
                PollenDataRequestValidator.SkipDateValidation = false;
            }
        }

        [Fact]
        public void TestWithDisabledDateValidation()
        {
            // Arrange
            PollenDataRequestValidator.SkipDateValidation = true;
            var testRequests = new List<PollenDataRequest>
            {
                new() { Date = new DateTime(1900, 1, 1), Latitude = 52.0, Longitude = 4.0 }
            };

            // Act & Assert
            var exception = Record.Exception(() => PollenDataRequestValidator.Validate(testRequests));
            Assert.Null(exception); // Geen validatiefout

            // Reset voor andere tests
            PollenDataRequestValidator.SkipDateValidation = false;
        }

        [Fact]
        public async Task GetPollenDataForDatesAndCoordinates_BigDateGap_ReturnsExpectedData()
        {
            // Arrange
            DateTime minDate = DateTime.ParseExact("23-2-2025 00:00:00", "d-M-yyyy HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime maxDate = DateTime.ParseExact("25-2-2025 00:00:00", "d-M-yyyy HH:mm:ss", CultureInfo.InvariantCulture);

            // Arrange
            var requests = new List<PollenDataRequest>
            {
                new PollenDataRequest { Latitude = 52.0, Longitude = 5.0, Date = minDate },
                new PollenDataRequest { Latitude = 52.0, Longitude = 5.0, Date = maxDate }
            };
            mockApiCall("TestData", "PollenApiByDateAndCoordinates2.json", HttpStatusCode.OK);

            // Tijdelijk datumvalidatie uitschakelen voor deze test
            PollenDataRequestValidator.SkipDateValidation = true;

            try
            {
                // Act
                var result = await _pollenService.GetPollenDataForDatesAndCoordinates(requests);

                // Assert
                Assert.NotNull(result);
                Assert.IsType<List<PollenDataPoint>>(result);
                Assert.Equal(2208, result.Count);
            }
            finally
            {
                // Zorg ervoor dat we de oorspronkelijke staat herstellen
                PollenDataRequestValidator.SkipDateValidation = false;
            }
        }
    }
}