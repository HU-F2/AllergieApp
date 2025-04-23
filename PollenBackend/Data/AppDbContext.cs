using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using PollenBackend.Models;

namespace PollenBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Location> Locations { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Apply value conversion for the Coordinates property
            modelBuilder.Entity<Location>()
                .Property(l => l.Coordinates)
                .HasConversion(
                    v => JsonConvert.SerializeObject(v), // Serialize list to JSON
                    v => JsonConvert.DeserializeObject<List<Coordinate>>(v) // Deserialize JSON back to list
                );
        }
    }
}
