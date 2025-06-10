using Moq;
using PollenBackend.Models;
using PollenBackend.Tests;

namespace PollenBackend.Services.WeatherServiceTests {
    public class GetThreeHourForecastTest : MockApiCall{
        private readonly HttpClient _httpClient;
        private WeatherService _weatherService;
        List<Coordinate> outofbounds_coordinates;

        public GetThreeHourForecastTest(){
            _mockHandler = new Mock<HttpMessageHandler>();
            _httpClient = new HttpClient(_mockHandler.Object);
            _weatherService = new WeatherService(_httpClient);

            outofbounds_coordinates = new List<Coordinate>(){
                // Test 1 negateive out of bound coordinaat
                new Coordinate(){Latitude=-95f,Longitude=5.1f},
                // Test 2 negatieve out of bound coordinaten
                new Coordinate(){Latitude=-195.0f,Longitude=-195.0f},
                // Test beide foutieve coordinaten 
                new Coordinate(){Latitude=97f,Longitude=250f},
                // Test 1 out of bounds coordinaten
                new Coordinate(){Latitude=2000f,Longitude=5.1f}
            };
        }
        [Fact]
        public async Task Forecast_WithOutOfBoundsCoordinates_ShouldReturnErrorOrNull(){
            foreach (var coord in outofbounds_coordinates)
            {
                var exception = await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => _weatherService.GetThreeHourForecast(coord.Latitude, coord.Longitude)); 
            }
        }

        [Fact]
        public async Task Forecast_WithinBoundCoordinates_ShouldReturnOk(){
            double latitude = 6;
            double longitude = 60;

            mockApiCall("TestData","WeatherApiOkReponse.json",System.Net.HttpStatusCode.OK);

            var result =await _weatherService.GetThreeHourForecast(latitude,longitude);

            Assert.IsType<WeatherData>(result);
        }
    }
}