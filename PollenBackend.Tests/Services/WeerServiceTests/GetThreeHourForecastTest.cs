using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using PollenBackend.Data;
using PollenBackend.Models;
using PollenBackend.Services;
using PollenBackend.Tests;

namespace PollenBackend.Services.WeerServiceTests {
    public class GetThreeHourForecastTest : MockApiCall{
        private readonly HttpClient _httpClient;
        private WeatherService _weerService;
        List<Coordinate> outOfBoundsCoordinates;

        public GetThreeHourForecastTest(){
            _mockHandler = new Mock<HttpMessageHandler>();
            _httpClient = new HttpClient(_mockHandler.Object);
            _weerService = new WeatherService(_httpClient);

            outOfBoundsCoordinates = new List<Coordinate>(){
                // Test 1 negatieve out of bound coördinaat
                new Coordinate(){Latitude=-95f,Longitude=5.1f},
                // Test 2 negatieve out of bound coördinaten
                new Coordinate(){Latitude=-195.0f,Longitude=-195.0f},
                // Test beide foutieve coördinaten
                new Coordinate(){Latitude=97f,Longitude=250f},
                // Test 1 out of bounds coördinaten
                new Coordinate(){Latitude=2000f,Longitude=5.1f}
            };
        }
        [Fact]
        public async Task Forecast_WithOutOfBoundsCoordinates_ShouldReturnErrorOrNull(){
            foreach (var coord in outOfBoundsCoordinates)
            {
                var exception = await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => _weerService.GetThreeHourForecast(coord.Latitude, coord.Longitude));
            }
        }

        [Fact]
        public async Task Forecast_WithinBoundCoordinates_ShouldReturnOk(){
            double latitude = 6;
            double longitude = 60;

            mockApiCall("TestData","WeatherApiOkReponse.json",System.Net.HttpStatusCode.OK);

            var result =await _weerService.GetThreeHourForecast(latitude,longitude);

            Assert.IsType<WeatherService>(result);
        }
    }
}