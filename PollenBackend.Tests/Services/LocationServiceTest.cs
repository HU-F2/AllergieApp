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
    public class LocationServiceTest
    {
        public LocationServiceTest()
        {
        }

        [Fact]
        public async Task GetLocationsList_ShouldReturnLocations_WithLatitudeLongitudeAndNameOnly()
        {
            // Prepare
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "InMemoryDb")
                .Options;

            using var context = new AppDbContext(options);

            var locations = new List<Location>
            {
                new Location
                {
                    Id = Guid.NewGuid(),
                    Name = "City 1",
                    Latitude = 12.34f,
                    Longitude = 56.78f,
                    Coordinates = new List<Coordinate> { new Coordinate { Latitude = 12.34f, Longitude = 56.78f } }
                },
                new Location
                {
                    Id = Guid.NewGuid(),
                    Name = "City 2",
                    Latitude = 23.45f,
                    Longitude = 67.89f,
                    Coordinates = new List<Coordinate> { new Coordinate { Latitude = 23.45f, Longitude = 67.89f } }
                }
            };

            context.Locations.AddRange(locations);
            await context.SaveChangesAsync();

            var locationService = new LocationService(context,null!);

            // Act
            var result = await locationService.GetLocationsList();

            // Test
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());

            foreach (var location in result)
            {
                Assert.NotNull(location.Name);
                Assert.InRange(location.Latitude, -90f, 90f);
                Assert.InRange(location.Longitude, -180f, 180f);

                Assert.Null(location.Coordinates); 
            }
        }
    }
}
