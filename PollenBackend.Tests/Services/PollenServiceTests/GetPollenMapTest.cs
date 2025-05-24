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
    public class GetPollenMapTest :MockApiCall
    {
        private readonly Mock<AppDbContext> _mockAppDbContext;
        private readonly Mock<ILocationService> _mockLocationService;
        private readonly IMemoryCache _memoryCache;
        private readonly HttpClient _httpClient;
        private readonly PollenService _pollenService;
        
        public GetPollenMapTest()
        {
            _mockHandler = new Mock<HttpMessageHandler>(); //From MockApiCall

            _mockAppDbContext = new Mock<AppDbContext>(new DbContextOptions<AppDbContext>());
            _mockLocationService = new Mock<ILocationService>();
            _memoryCache = new MemoryCache(new MemoryCacheOptions());
            _httpClient = new HttpClient(_mockHandler.Object);
            _pollenService = new PollenService(_mockAppDbContext.Object,_mockLocationService.Object,_httpClient, _memoryCache);
        }

        [Fact]
        public async Task GetPollenMap_CacheHit_ReturnsCachedData()
        {
            // Arrange
            var cacheKey = "PollenMap";

            _mockLocationService.Setup(s => s.GetLocations()).ReturnsAsync(new List<Location>
            {
                new Location { Name = "Test 1", Latitude = 52.1f, Longitude = 5.1f },
                new Location { Name = "Test 2", Latitude = 53.0f, Longitude = 6.0f }
            });

            mockApiCall("TestData","PollenApiResponse.json", HttpStatusCode.OK);

            // Act
            var result = (await _pollenService.GetPollenMap()).ToList();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);

            // Check cache
            Assert.True(_memoryCache.TryGetValue(cacheKey, out var cachedData));
            Assert.Equal(result, cachedData);

            // Second cached request
            _mockHandler.Invocations.Clear();

            var secondCallResult = (await _pollenService.GetPollenMap()).ToList();

            // Assert
            Assert.NotNull(secondCallResult);
            Assert.Equal(result, secondCallResult);

            // Make sure when cached it doesnt call the api
            _mockHandler
                .Protected()
                .Verify("SendAsync", Times.Never(), ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>());
        }

        [Fact]
        public async Task GetPollenMap_CacheMiss_ReturnsApiDataAndCachesIt()
        {
            // Arrange
            var cacheKey = "PollenMap";

            _mockLocationService.Setup(s => s.GetLocations()).ReturnsAsync(new List<Location>
            {
                new Location { Name = "Test 1", Latitude = 52.1f, Longitude = 5.1f },
                new Location { Name = "Test 2", Latitude = 53.0f, Longitude = 6.0f }
            });

            mockApiCall("TestData","PollenApiResponse.json", HttpStatusCode.OK);

            // Act
            var result = (await _pollenService.GetPollenMap()).ToList();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);

            // Check cache
            Assert.True(_memoryCache.TryGetValue(cacheKey, out var cachedData));
            Assert.Equal(result, cachedData);
        }

        [Fact]
        public async Task GetPollenMap_CacheMiss_ApiFailureThrowsHttpRequestException()
        {
            // Arrange
            _mockLocationService.Setup(s => s.GetLocations()).ReturnsAsync(new List<Location>
            {
                new Location { Name = "FailTest 1", Latitude = 40.0f, Longitude = -70.0f }
            });

            mockApiCall("TestData", "PollenApiBadRequest.json", HttpStatusCode.BadRequest);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<HttpRequestException>(() => _pollenService.GetPollenMap());
            Assert.StartsWith("Request to pollen API failed:", exception.Message);
        }
    }
}