using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using PollenBackend.Controllers;
using PollenBackend.Models;
using PollenBackend.Services;

namespace PollenBackend.Tests.Controllers.WeatherControllerTests
{
    public class GetThreeHourForecastTest
    {
        private readonly Mock<IWeatherService> _mockWeerService;
        private readonly IMemoryCache _memoryCache;
        private readonly WeatherController _controller;

        public GetThreeHourForecastTest()
        {
            _mockWeerService = new Mock<IWeatherService>();
            _memoryCache = new MemoryCache(new MemoryCacheOptions());
            _controller = new WeatherController(_mockWeerService.Object, _memoryCache);
        }

        [Fact]
        public async Task GetThreeHourForecast_ReturnsOkResult_WithWeatherData()
        {
            // Test data
            var latitude = 52.0;
            var longitude = 4.0;

            var mockWeatherData = new WeatherData
            {
                AverageTemperature = 16.0,
                AverageRain = 0.2,
                AverageWind = 9.0
            };

            _mockWeerService
                .Setup(s => s.GetThreeHourForecast(latitude, longitude))
                .ReturnsAsync(mockWeatherData);

            // VOer de mocked functie uit
            var result = await _controller.GetThreeHourForecast(latitude, longitude);

            // Kijk of het klopt
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedData = Assert.IsType<WeatherData>(okResult.Value);
            Assert.Equal(mockWeatherData.AverageTemperature, returnedData.AverageTemperature);
            Assert.Equal(mockWeatherData.AverageRain, returnedData.AverageRain);
            Assert.Equal(mockWeatherData.AverageWind, returnedData.AverageWind);
        }

        [Fact]
        public async Task GetThreeHourForecast_HandlesHttpRequestException_ReturnsServiceUnavailable()
        {
            // Arrange
            var latitude = 0.0;
            var longitude = 0.0;

            var exception = new HttpRequestException("Data niet bereikbaar", null, HttpStatusCode.BadGateway);

            _mockWeerService
                .Setup(s => s.GetThreeHourForecast(latitude, longitude))
                .ThrowsAsync(exception);

            // Act
            var result = await _controller.GetThreeHourForecast(latitude, longitude);

            // Assert
            var objectResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal((int)HttpStatusCode.BadGateway, objectResult.StatusCode);

            string? valueString = objectResult.Value?.ToString();
            Assert.NotNull(valueString);
            Assert.Contains("Data niet bereikbaar", valueString ?? string.Empty);
        }

        [Fact]
        public async Task GetThreeHourForecast_ReturnsInternalServerError_WhenNoDataForNext3Hours()
        {
            // Arrange
            var latitude = 52.0;
            var longitude = 4.0;

            string exceptionMessage = "Geen bruikbare data voor de komende 3 uur gevonden.";

            _mockWeerService
                .Setup(s => s.GetThreeHourForecast(latitude, longitude))
                .ThrowsAsync(new Exception(exceptionMessage));

            var result = await _controller.GetThreeHourForecast(latitude, longitude);

            var objectResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, objectResult.StatusCode);
            Assert.NotNull(objectResult.Value);
            Assert.Contains(exceptionMessage, objectResult.Value.ToString());
        }


    }
}
