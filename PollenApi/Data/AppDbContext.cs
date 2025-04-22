using Microsoft.EntityFrameworkCore;
using PollenApi.Models;

namespace PollenApi
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Add DbSet properties for your models here
        public DbSet<User> Users { get; set; }
    }
}
