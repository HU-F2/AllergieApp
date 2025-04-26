using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using PollenBackend.Controllers;
using PollenBackend.Models;
using PollenBackend.Services;

namespace PollenBackend.Tests.Controllers
{
    public class PollenControllerTests
    {
        public PollenControllerTests()
        {
        }

        [Fact]
        public async Task GetByLocation_ShouldReturnCachedData_WhenCacheHit()
        {
            var latitude = 52.1;
            var longitude = 5.1;
            var cacheKey = $"PollenData-{latitude}-{longitude}";
            var cachedData = new PollenData { Latitude=latitude,Longitude=longitude };

            var memoryCache = new MemoryCache(new MemoryCacheOptions());
            memoryCache.Set(cacheKey, cachedData);

            var mockPollenService = new Mock<IPollenService>();
            var controller = new PollenController(mockPollenService.Object, memoryCache);

            // Act
            var actionResult = await controller.GetByLocation(latitude, longitude);

            // Check if the Result property is an OkObjectResult
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.Equal(cachedData, okResult.Value);
        }

        [Fact]
        public async Task GetByLocation_ShouldCallServiceAndCacheData_WhenCacheMiss()
        {
            var latitude = 52.1;
            var longitude = 5.1;
            var cacheKey = $"PollenData-{latitude}-{longitude}";
            var pollenData = new PollenData { Latitude = latitude, Longitude = longitude };

            // Create a new MemoryCache for this test case
            var memoryCache = new MemoryCache(new MemoryCacheOptions());

            // Mock the PollenService to return the pollenData
            var mockPollenService = new Mock<IPollenService>();
            mockPollenService
                .Setup(service => service.GetCurrentPollenFromLocation(latitude, longitude))
                .ReturnsAsync(pollenData);

            var controller = new PollenController(mockPollenService.Object, memoryCache);

            // Act
            var actionResult = await controller.GetByLocation(latitude, longitude);

            // Assert that the service call was made and the data was returned
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.Equal(pollenData, okResult.Value);

            // Verify that the data was cached
            var cachedData = memoryCache.Get<PollenData>(cacheKey);
            Assert.Equal(pollenData, cachedData);
        }

        [Fact]
        public async Task GetByLocation_ShouldReturnServiceUnavailable_WhenServiceThrowsHttpRequestException()
        {
            var latitude = 52.1;
            var longitude = 5.1;

            // Create a new MemoryCache for this test case
            var memoryCache = new MemoryCache(new MemoryCacheOptions());

            // Mock the PollenService to throw an HttpRequestException without a status code (so it defaults to 503)
            var mockPollenService = new Mock<IPollenService>();
            mockPollenService
                .Setup(service => service.GetCurrentPollenFromLocation(latitude, longitude))
                .ThrowsAsync(new HttpRequestException("Service error"));

            var controller = new PollenController(mockPollenService.Object, memoryCache);

            // Act
            var actionResult = await controller.GetByLocation(latitude, longitude);

            // Assert that the result is an ObjectResult with a 503 status code
            var objectResult = Assert.IsType<ObjectResult>(actionResult.Result);
            Assert.Equal((int)HttpStatusCode.ServiceUnavailable, objectResult.StatusCode);
        }
    }
}