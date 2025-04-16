using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AllergieAppBackend.Data;
using AllergieAppBackend.Models;

namespace AllergieAppBackend.Repositories
{
    public class RecipeRepository : IRecipeRepository
    {
        private readonly AppDbContext _context;

        public RecipeRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Recipe>> GetRecipesFilteredByAllergensAsync(List<string> allergensToExclude)
        {
            return await _context.Recipes
                .Include(r => r.Ingredients)
                    .ThenInclude(i => i.Allergens)
                .Where(r => !r.Ingredients.Any(i => i.Allergens.Any(a => allergensToExclude.Contains(a.Name))))
                .ToListAsync();
        }
    }
}