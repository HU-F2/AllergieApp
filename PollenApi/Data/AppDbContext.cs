using Microsoft.EntityFrameworkCore;
using PollenApi.Models;

namespace PollenApi.Data
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
