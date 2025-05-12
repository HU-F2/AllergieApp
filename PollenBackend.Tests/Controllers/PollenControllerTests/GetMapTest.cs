using System.Net;
using Microsoft.AspNetCore.Mvc;
using Moq;
using PollenBackend.Controllers;
using PollenBackend.Models;
using PollenBackend.Services;

namespace PollenBackend.Tests.Controllers.PollenControllerTests
{
    public class GetMapTest
    {

        private readonly Mock<IPollenService> _mockPollenService;
        private readonly PollenController _controller;
        public GetMapTest()
        {
            _mockPollenService = new Mock<IPollenService>();
            _controller = new PollenController(_mockPollenService.Object);
        }

        [Fact]
        public async Task GetMap_ReturnsOkResult_WithPollenData()
        {
            var testData = new List<PollenData>
            {
                new PollenData
                {
                    Latitude = 51.5,
                    Longitude = -0.1,
                    Hourly = new HourlyData
                    {
                        BirchPollen = new List<double?> { 12.3 },
                        GrassPollen = new List<double?> { 3.1 }
                    },
                    HourlyUnits = new HourlyUnits
                    {
                        BirchPollen = "µg/m³",
                        GrassPollen = "µg/m³"
                    },
                    Location = new Location { Name = "London" }
                }
            };

            _mockPollenService.Setup(s => s.GetPollenMap()).ReturnsAsync(testData);

            // Act
            var result = await _controller.GetMap();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var data = Assert.IsType<List<PollenData>>(okResult.Value);
            Assert.Single(data);
            Assert.Equal(51.5, data[0].Latitude);
            Assert.Equal("London", data[0].Location?.Name);
        }

        [Fact]
        public async Task GetMap_WhenHttpRequestExceptionThrown_ReturnsStatusCodeWithError()
        {
            // Arrange
            var exception = new HttpRequestException("API unavailable", null, HttpStatusCode.BadGateway);

            _mockPollenService.Setup(s => s.GetPollenMap()).ThrowsAsync(exception);

            // Act
            var result = await _controller.GetMap();

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal((int)HttpStatusCode.BadGateway, statusResult.StatusCode);
        }
    }
}