using Microsoft.EntityFrameworkCore;
using Moq;
using PollenBackend.Data;
using PollenBackend.Models;
using PollenBackend.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using System.Text;
using System.Net;
using Moq.Protected;
using System.Net.Http;
using System.IO;
using System.Threading;

namespace PollenBackend.Tests.Services
{
    public class PollenServiceTest
    {
        // This constructor was not needed because we're mocking everything we need.
        public PollenServiceTest()
        {
        }

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

            // Create service and call
            var pollenService = new PollenService(null, mockLocationService.Object, httpClient);
            var result = (await pollenService.GetPollenMap()).ToList();

            // Tests
            Assert.Equal(2, result.Count);

            Assert.Equal("Test 1", result[0].Location?.Name);
            Assert.Equal("Test 2", result[1].Location?.Name);

            Assert.NotNull(result[0].Hourly);
            Assert.NotNull(result[0].Hourly.BirchPollen);
            Assert.NotNull(result[0].Hourly.GrassPollen);

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

            var pollenService = new PollenService(null, mockLocationService.Object, httpClient);
            var exception = await Assert.ThrowsAsync<HttpRequestException>(() => pollenService.GetPollenMap());

            // Tests
            Assert.StartsWith("Request to pollen API failed", exception.Message);
        }
    }
}
