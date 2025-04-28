using Moq;
using PollenBackend.Models;
using PollenBackend.Services;
using PollenBackend.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace PollenBackend.Tests.Controllers.LocationControllerTests
{
    public class GetLocationsListTest
    {

        private readonly Mock<ILocationService> _mockLocationService;
        private readonly LocationController _controller;
        public GetLocationsListTest()
        {
            _mockLocationService = new Mock<ILocationService>();
            var memoryCache = new MemoryCache(new MemoryCacheOptions());
            _controller = new LocationController(_mockLocationService.Object,memoryCache);
        }

        [Fact]
        public async Task GetLocationsList_ReturnsOkResult_WithLocations()
        {
            // Prepare
            var mockLocations = new List<Location>
            {
                new Location { Id = Guid.NewGuid(), Name = "Location 1", Latitude = 10.0f, Longitude = 20.0f },
                new Location { Id = Guid.NewGuid(), Name = "Location 2", Latitude = 15.0f, Longitude = 25.0f }

            };
            _mockLocationService.Setup(service => service.GetLocationsList()).ReturnsAsync(mockLocations);

            // Act
            var result = await _controller.GetLocationsList();

            // Test
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsAssignableFrom<IEnumerable<Location>>(okResult.Value);
            Assert.Equal(2, returnValue.Count());
        }

        [Fact]
        public async Task GetLocationsList_ReturnsOkResult_WithEmptyList()
        {
            // Prepare
            var mockLocations = new List<Location>();
            _mockLocationService.Setup(service => service.GetLocationsList()).ReturnsAsync(mockLocations);

            // Act
            var result = await _controller.GetLocationsList();

            // Test
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsAssignableFrom<IEnumerable<Location>>(okResult.Value);
            Assert.Empty(returnValue);
        }
    }
}