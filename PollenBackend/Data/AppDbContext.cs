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
        public DbSet<Flora> Flora { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Save coordinates in db
            modelBuilder.Entity<Location>()
                .Property(l => l.Coordinates)
                .HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<List<Coordinate>>(v) ?? new List<Coordinate>{}
                );
        }
    }
}
