using PollenBackend.Models;
using PollenBackend.Services;

namespace PollenBackend.Data
{
    public class Seeder
    {
        private readonly AppDbContext _context;
        private readonly ILocationService _locationService;

        public Seeder(AppDbContext context,ILocationService locationService)
        {
            _context = context;
            _locationService = locationService;
        }

        public async Task Seed()
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
                var locations = await _locationService.GetMunicipality();
                _context.Locations.AddRange(locations);
                
                _context.SaveChanges();
            }
        }
    }
}