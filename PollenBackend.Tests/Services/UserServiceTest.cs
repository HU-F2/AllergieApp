using Microsoft.EntityFrameworkCore;
using Moq;
using PollenBackend.Data;
using PollenBackend.Models;
using PollenBackend.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace PollenBackend.Tests.Services
{
    public class UserServiceTests
    {
        private readonly UserService _userService;
        private readonly AppDbContext _dbContext;

        public UserServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "PollenAppTestDb")
                .Options;

            _dbContext = new AppDbContext(options);
            _userService = new UserService(_dbContext);
            
            if (!_dbContext.Users.Any())
            {
                _dbContext.Users.AddRange(new List<User>
                {
                    new User { Username = "user1" },
                    new User { Username = "user2" }
                });
                _dbContext.SaveChanges();
            }

        }

        [Fact]
        public async Task GetUsers_ReturnsListOfUsers()
        {
            // Act: Call the method to test
            var result = await _userService.GetUsers();

            // Assert: Verify the result
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal("user1", result[0].Username);
            Assert.Equal("user2", result[1].Username);
        }

        [Fact]
        public void CreateUser_ThrowsNotImplementedException()
        {
            // Act & Assert: Ensure that CreateUser throws a NotImplementedException
            var exception = Assert.ThrowsAsync<NotImplementedException>(() => _userService.CreateUser("user3"));
            Assert.NotNull(exception);
        }
    }
}
