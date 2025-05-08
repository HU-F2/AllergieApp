using System.Net;
using Microsoft.AspNetCore.Mvc;
using Moq;
using PollenBackend.Controllers;
using PollenBackend.Models;
using PollenBackend.Services;

namespace PollenBackend.Tests.Controllers.PollenControllerTests
{
    public class GetByLocationTest
    {

        private readonly Mock<IPollenService> _mockPollenService;
        private readonly PollenController _controller;
        public GetByLocationTest()
        {
            _mockPollenService = new Mock<IPollenService>();
            _controller = new PollenController(_mockPollenService.Object);
        }

        [Fact]
        public async Task GetByLocation_ReturnsOkResult_WithPollenData()
        {
            // Arrange
            var sampleLatitude = 51.5074;
            var sampleLongitude = -0.1278;

            var mockPollenData = new PollenData
            {
                Latitude = sampleLatitude,
                Longitude = sampleLongitude,
                HourlyUnits = new HourlyUnits { Time = "iso8601", BirchPollen = "gr/m3" },
                Hourly = new HourlyData
                {
                    Time = new List<string> { "2025-05-08T12:00" },
                    BirchPollen = new List<double?> { 10.5 }
                }
            };

            _mockPollenService
                .Setup(s => s.GetCurrentPollenFromLocation(sampleLatitude, sampleLongitude))
                .ReturnsAsync(mockPollenData);

            // Act
            var result = await _controller.GetByLocation(sampleLatitude, sampleLongitude);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedData = Assert.IsType<PollenData>(okResult.Value);
        }

        [Fact]
        public async Task GetByLocation_HandlesHttpRequestException_ReturnsServiceUnavailable()
        {
            // Arrange
            var sampleLatitude = 0.0;
            var sampleLongitude = 0.0;

            var httpException = new HttpRequestException("Service error", null, HttpStatusCode.BadGateway);

            _mockPollenService
                .Setup(s => s.GetCurrentPollenFromLocation(sampleLatitude, sampleLongitude))
                .ThrowsAsync(httpException);

            // Act
            var result = await _controller.GetByLocation(sampleLatitude, sampleLongitude);

            // Assert
            var objectResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal((int)HttpStatusCode.BadGateway, objectResult.StatusCode);
            Assert.NotNull(objectResult.Value);
            Assert.Contains("Service error", objectResult.Value.ToString());
        }
    }
}