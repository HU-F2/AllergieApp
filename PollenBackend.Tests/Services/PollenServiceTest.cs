using Moq;
using PollenBackend.Models;
using PollenBackend.Services;
using System.Text;
using System.Net;
using Moq.Protected;
using PollenBackend.Data;
using Microsoft.EntityFrameworkCore;

namespace PollenBackend.Tests.Services
{
    public class PollenServiceTest
    {
        public PollenServiceTest()
        {
        }

        // Get Pollen Map
        [Fact]
        public async Task GetPollenMap_ReturnsPollenDataForLocations()
        {
            // Mock Location Service
            var mockLocationService = new Mock<ILocationService>();

            mockLocationService.Setup(s => s.GetLocations()).ReturnsAsync(new List<Location>
            {
                new Location { Name = "Test 1", Latitude = 52.1f, Longitude = 5.1f },
                new Location { Name = "Test 2", Latitude = 53.0f, Longitude = 6.0f }
            });

            // Mock Api Request with example api json return
            string path = Path.Combine(AppContext.BaseDirectory, "TestData", "PollenApiResponse.json");
            string json = File.ReadAllText(path);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var fakeResponse = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = content
            };

            var mockHandler = new Mock<HttpMessageHandler>();
            mockHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(), 
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(fakeResponse); 

            var httpClient = new HttpClient(mockHandler.Object);

            // Mock db
            var mockDbContext = new Mock<AppDbContext>(new DbContextOptions<AppDbContext>());

            // Create service and call
            var pollenService = new PollenService(mockDbContext.Object, mockLocationService.Object, httpClient);
            var result = (await pollenService.GetPollenMap()).ToList();

            // Tests
            Assert.Equal(2, result.Count);

            Assert.Equal("Test 1", result[0].Location?.Name);
            Assert.Equal("Test 2", result[1].Location?.Name);

            Assert.NotNull(result[0].Hourly);
            Assert.NotNull(result[0]?.Hourly?.BirchPollen);
            Assert.NotNull(result[0]?.Hourly?.GrassPollen);

        }

        [Fact]
        public async Task GetPollenMap_ShouldThrowHttpRequestException_WhenApiRequestFails()
        {
            var mockLocationService = new Mock<ILocationService>();

            var mockHandler = new Mock<HttpMessageHandler>();
            string path = Path.Combine(AppContext.BaseDirectory, "TestData", "PollenApiBadRequest.json");
            string json = File.ReadAllText(path);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var fakeResponse = new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                Content = content
            };

            mockHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(), 
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(fakeResponse); 

            var httpClient = new HttpClient(mockHandler.Object);

            // Mock db
            var mockDbContext = new Mock<AppDbContext>(new DbContextOptions<AppDbContext>());

            var pollenService = new PollenService(mockDbContext.Object, mockLocationService.Object, httpClient);
            var exception = await Assert.ThrowsAsync<HttpRequestException>(() => pollenService.GetPollenMap());

            // Tests
            Assert.StartsWith("Request to pollen API failed", exception.Message);
        }

        // Get Current Pollen By Location
        [Fact]
        public async Task GetCurrentPollenFromLocation_ReturnsPollenData()
        {
            var latitude = 52.1;
            var longitude = 5.1;
             // Mock Location Service
            var mockLocationService = new Mock<ILocationService>();

            // Mock Api Request with example api json return
            string path = Path.Combine(AppContext.BaseDirectory, "TestData", "PollenApiCurrentByLocation.json");
            string json = File.ReadAllText(path);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var fakeResponse = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = content
            };

            var mockHandler = new Mock<HttpMessageHandler>();
            mockHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(), 
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(fakeResponse); 

            var httpClient = new HttpClient(mockHandler.Object);

            // Mock db
            var mockDbContext = new Mock<AppDbContext>(new DbContextOptions<AppDbContext>());

            // Create service and call
            var pollenService = new PollenService(mockDbContext.Object, mockLocationService.Object, httpClient);
            var result = await pollenService.GetCurrentPollenFromLocation(latitude,longitude);

            // Tests
            Assert.NotNull(result);
            Assert.NotEqual(0, result.Latitude);
            Assert.NotEqual(0, result.Longitude);
            Assert.NotNull(result.Hourly);
            Assert.NotNull(result.Hourly.BirchPollen); 
            Assert.NotEmpty(result.Hourly.BirchPollen);
        }

        [Fact]
        public async Task GetCurrentPollenFromLocation_ShouldThrowHttpRequestException_WhenApiRequestFails()
        {
            var latitude = 52.1;
            var longitude = 5.1;

            var mockLocationService = new Mock<ILocationService>();

            var mockHandler = new Mock<HttpMessageHandler>();
            string path = Path.Combine(AppContext.BaseDirectory, "TestData", "PollenApiBadRequest.json");
            string json = File.ReadAllText(path);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var fakeResponse = new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                Content = content
            };

            mockHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(), 
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(fakeResponse); 

            var httpClient = new HttpClient(mockHandler.Object);

            // Mock db
            var mockDbContext = new Mock<AppDbContext>(new DbContextOptions<AppDbContext>());

            var pollenService = new PollenService(mockDbContext.Object, mockLocationService.Object, httpClient);
            var exception = await Assert.ThrowsAsync<HttpRequestException>(() => pollenService.GetCurrentPollenFromLocation(latitude,longitude));

            // Tests
            Assert.StartsWith("Request to pollen API failed", exception.Message);
        }
    }
}
