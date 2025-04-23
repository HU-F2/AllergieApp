using PollenBackend.Models;

namespace PollenBackend.Data
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

            if(!_context.Locations.Any()){
                _context.Locations.AddRange(
                    new Location{Name="Hoevelaken", Latitude=52.17524495883361F, Longitude=5.460534964428301F},
                    new Location{Name="Vreeland", Latitude=52.22853344210912F, Longitude=5.029018155942634F}
                );
                
                _context.SaveChanges();
            }
        }
    }
}