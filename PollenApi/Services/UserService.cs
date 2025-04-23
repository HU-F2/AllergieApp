using Microsoft.EntityFrameworkCore;
using PollenApi.Data;
using PollenApi.Models;

namespace PollenApi.Services
{
    public interface IUserService
    {
        Task<User> CreateUser(string username);
        Task<List<User>> GetUsers();
    }


    public class UserService : IUserService
    {

        private readonly AppDbContext _dbContext;

        // Inject ApplicationDbContext through constructor
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