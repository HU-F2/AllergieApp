using System.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using PollenBackend.Data;
using PollenBackend.Models;
using PollenBackend.Services;

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

            // Act
            var result = await _pollenService.GetPollenDataForDatesAndCoordinates(requests);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(48, result.Count);
            Assert.Contains(result, r => r.BirchPollen == 0.5);
            Assert.Contains(result, r => r.BirchPollen == 0.6);
        }
    }
}