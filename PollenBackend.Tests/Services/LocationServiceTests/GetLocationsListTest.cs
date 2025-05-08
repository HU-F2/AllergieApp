using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using PollenBackend.Data;
using PollenBackend.Models;
using PollenBackend.Services;

namespace PollenBackend.Tests.Services.LocationServiceTest
{
    public class GetLocationsListTest
    {
        private readonly AppDbContext _appDbContext;
        private readonly IMemoryCache _memoryCache;
        private readonly LocationService _locationService;
        public GetLocationsListTest()
        {
             var dbOptions = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "InMemoryDb")
                .Options;
            _appDbContext = new AppDbContext(dbOptions);
            _memoryCache = new MemoryCache(new MemoryCacheOptions());
            _locationService = new LocationService(_appDbContext,null!,_memoryCache);
        }

        [Fact]
        public async Task GetLocationsList_ShouldReturnLocations_WithLatitudeLongitudeAndNameOnly()
        {
            // Arrange
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

            _appDbContext.Locations.AddRange(locations);
            await _appDbContext.SaveChangesAsync();

             // Act
            var result = await _locationService.GetLocationsList();

            // Assert
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