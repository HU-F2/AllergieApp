using PollenApi.Models;

namespace PollenApi.Services
{
    public interface IUserService
    {
        Task<User> CreateUser(string username);
    }


    public class UserService : IUserService
    {
        public Task<User> CreateUser(string username)
        {
            throw new NotImplementedException();
        }
    }
}