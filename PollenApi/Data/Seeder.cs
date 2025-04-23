using PollenApi.Models;

namespace PollenApi.Data
{
    public class Seeder
    {
        private readonly AppDbContext _context;

        public Seeder(AppDbContext context)
        {
            _context = context;
        }

        public void Seed()
        {
            if (!_context.Users.Any())
            {
                _context.Users.AddRange(
                    new User { Username = "John Doe" },
                    new User { Username = "Jane Smith" },
                    new User { Username = "Jim Brown" }
                );

                _context.SaveChanges();
            }
        }
    }
}