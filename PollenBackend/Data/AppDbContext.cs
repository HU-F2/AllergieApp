using Microsoft.EntityFrameworkCore;
using PollenBackend.Models;

namespace PollenBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // Add DbSet properties for your models here
        public DbSet<User> Users { get; set; }
    }
}
