using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using Moq.Protected;
using PollenBackend.Data;
using PollenBackend.Models;
using PollenBackend.Services;
using PollenBackend.Tests;

namespace PollenBackend.Services.WeerServiceTests {
    public class GetThreeHourForecastTest : MockApiCall
    {
        private readonly HttpClient _httpClient;
        private WeatherService _weerService;
        List<Coordinate> outOfBoundsCoordinates;

        public GetThreeHourForecastTest()
        {
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
        public async Task Forecast_WithOutOfBoundsCoordinates_ShouldReturnErrorOrNull()
        {
            foreach (var coord in outOfBoundsCoordinates)
            {
                var exception = await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => _weerService.GetThreeHourForecast(coord.Latitude, coord.Longitude));
            }
        }

        [Fact]
        public async Task Forecast_WithinBoundCoordinates_ShouldReturnOk()
        {
            double latitude = 6;
            double longitude = 60;

            // Load and modify the JSON dynamically
            var updatedJson = LoadAndUpdateWeatherJson("TestData/WeatherApiOkReponse.json");

            var responseMessage = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
            {
                Content = new StringContent(updatedJson, System.Text.Encoding.UTF8, "application/json")
            };

            // Mock protected SendAsync
            _mockHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(responseMessage);

            // Call the actual method
            var result = await _weerService.GetThreeHourForecast(latitude, longitude);

            // Assert result
            Assert.IsType<WeatherData>(result);
            Assert.True(result.AverageTemperature > 0); // optional, but nice sanity check
        }

        

        private string LoadAndUpdateWeatherJson(string filePath, int hoursToGenerate = 72)
            {
                // Read the file
                var json = File.ReadAllText(filePath);
                
                // Parse the JSON into a mutable object
                using var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;

                // Deserialize into a dictionary to modify it easily
                var rootDict = JsonSerializer.Deserialize<Dictionary<string, object>>(json);

                // Generate new timestamps
                var now = DateTime.UtcNow;
                var newTimes = Enumerable.Range(0, hoursToGenerate)
                    .Select(i => now.AddHours(i).ToString("yyyy-MM-ddTHH:00"))
                    .ToArray();

                // Replace the time array (and optionally trim other arrays to match length)
                using var updatedDoc = JsonDocument.Parse(json);
                var hourly = updatedDoc.RootElement.GetProperty("hourly");

                var updatedHourly = new Dictionary<string, object>
                {
                    ["time"] = newTimes
                };

                // Optional: trim the other hourly arrays to match length
                foreach (var prop in hourly.EnumerateObject())
                {
                    if (prop.Name != "time")
                    {
                        var values = prop.Value.EnumerateArray()
                            .Take(hoursToGenerate)
                            .Select(v => v.ValueKind switch
                            {
                                JsonValueKind.Number => v.GetDouble(),
                                _ => 0.0
                            })
                            .ToArray();

                        updatedHourly[prop.Name] = values;
                    }
                }

                var output = new
                {
                    latitude = root.GetProperty("latitude").GetDouble(),
                    longitude = root.GetProperty("longitude").GetDouble(),
                    timezone = root.GetProperty("timezone").GetString(),
                    hourly = updatedHourly
                };

                return JsonSerializer.Serialize(output);
            }

    }
}