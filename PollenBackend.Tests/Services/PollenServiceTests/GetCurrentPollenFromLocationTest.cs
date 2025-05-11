using System.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using Moq.Protected;
using PollenBackend.Data;
using PollenBackend.Models;
using PollenBackend.Services;

namespace PollenBackend.Tests.Services.PollenServiceTests
{
    public class GetCurrentPollenFromLocationTest : MockApiCall
    {
        private readonly Mock<AppDbContext> _mockAppDbContext;
        private readonly Mock<ILocationService> _mockLocationService;
        private readonly IMemoryCache _memoryCache;
        private readonly HttpClient _httpClient;
        private readonly PollenService _pollenService;
        public GetCurrentPollenFromLocationTest()
        {
            _mockHandler = new Mock<HttpMessageHandler>(); // From MockApiCall

            _mockAppDbContext = new Mock<AppDbContext>(new DbContextOptions<AppDbContext>());
            _mockLocationService = new Mock<ILocationService>();
            _memoryCache = new MemoryCache(new MemoryCacheOptions());
            _httpClient = new HttpClient(_mockHandler.Object);
            _pollenService = new PollenService(_mockAppDbContext.Object,_mockLocationService.Object,_httpClient, _memoryCache);
        }

        [Fact]
        public async Task GetCurrentPollenFromLocation_CacheHit_ReturnsCachedData()
        {
            // Arrange
            var latitude = 51.5074;
            var longitude = -0.1278;
            var cacheKey = $"PollenData-{latitude}-{longitude}";

            var cachedPollenData = new PollenData
            {
                Latitude = latitude,
                Longitude = longitude
            };

            _memoryCache.Set(cacheKey, cachedPollenData);

            mockApiCall("TestData","PollenApiCurrentByLocation.json",HttpStatusCode.OK);

            // Act
            var result = await _pollenService.GetCurrentPollenFromLocation(latitude, longitude);

            // Assert
            Assert.Equal(cachedPollenData, result);
            _mockHandler.Protected().Verify(
                "SendAsync",
                Times.Never(),
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            );
        }

        [Fact]
        public async Task GetCurrentPollenFromLocation_CacheMiss_ReturnsApiDataAndCachesIt()
        {
            // Arrange
            var latitude = 51.5074;
            var longitude = -0.1278;
            var cacheKey = $"PollenData-{latitude}-{longitude}";

            mockApiCall("TestData","PollenApiCurrentByLocation.json",HttpStatusCode.OK);

            // Act
            var result = await _pollenService.GetCurrentPollenFromLocation(latitude, longitude);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<PollenData>(result);

            _mockHandler.Protected().Verify(
                "SendAsync",
                Times.Once(),
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            );

            // Check cache
            Assert.True(_memoryCache.TryGetValue(cacheKey, out var cachedData));
            Assert.Equal(result, cachedData);
        }

        [Fact]
        public async Task GetCurrentPollenFromLocation_ApiFails_ThrowsHttpRequestException()
        {
            // Arrange
            var latitude = 51.5074;
            var longitude = -0.1278;

            mockApiCall("TestData","PollenApiBadRequest.json",HttpStatusCode.BadRequest);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<HttpRequestException>(() =>
                _pollenService.GetCurrentPollenFromLocation(latitude, longitude));

            Assert.StartsWith("Request to pollen API failed:", exception.Message);
        }
    }
}