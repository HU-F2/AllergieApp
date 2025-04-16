using Microsoft.EntityFrameworkCore;
using AllergieAppBackend.Models;

namespace AllergieAppBackend.Data
{
    public class AppDbContext : DbContext
    {
        // public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // public DbSet<Recipe> Recipes { get; set; }
        // public DbSet<Ingredient> Ingredients { get; set; }
        // public DbSet<Allergen> Allergens { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Recipe> Recipes => Set<Recipe>();
        public DbSet<Ingredient> Ingredients => Set<Ingredient>();
        public DbSet<Allergen> Allergens => Set<Allergen>();
        public DbSet<RecipeIngredient> RecipeIngredients => Set<RecipeIngredient>();
        public DbSet<IngredientAllergen> IngredientAllergens => Set<IngredientAllergen>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RecipeIngredient>().HasKey(ri => new { ri.RecipeId, ri.IngredientId });
            modelBuilder.Entity<IngredientAllergen>().HasKey(ia => new { ia.IngredientId, ia.AllergenId });
        }
    }
}