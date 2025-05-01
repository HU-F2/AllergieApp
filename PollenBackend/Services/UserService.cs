using Microsoft.EntityFrameworkCore;
using PollenBackend.Data;
using PollenBackend.Models;

namespace PollenBackend.Services
{
    public class UserService
    {
        private readonly AppDbContext _dbContext;

        public UserService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<User> CreateUser(string username)
        {
            throw new NotImplementedException();
        }

        public async Task<List<User>> GetUsers()
        {
            return await _dbContext.Users.ToListAsync();
        }
    }
}