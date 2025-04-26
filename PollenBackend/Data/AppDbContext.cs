using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
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

            // Save coordinates in db
            modelBuilder.Entity<Location>()
                .Property(l => l.Coordinates)
                .HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<List<Coordinate>>(v) ?? new List<Coordinate>{}
                )
                .Metadata.SetValueComparer(new ValueComparer<List<Coordinate>>(
                    (c1, c2) => (c1 == null && c2 == null) || (c1 != null && c2 != null && c1.SequenceEqual(c2)),
                    c => c == null 
                        ? 0 
                        : c.Aggregate(0, (a, v) => HashCode.Combine(a, v.Latitude.GetHashCode(), v.Longitude.GetHashCode())),
                    c => c == null
                        ? new List<Coordinate>()
                        : c.Select(x => new Coordinate { Latitude = x.Latitude, Longitude = x.Longitude }).ToList()
                ));
        }
    }
}
