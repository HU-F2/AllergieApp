using Microsoft.EntityFrameworkCore;
using AllergieAppBackend.Models;

namespace AllergieAppBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<Allergen> Allergens { get; set; }
    }
}