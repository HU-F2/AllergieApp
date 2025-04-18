using AllergieAppBackend.Models;
using AllergieAppBackend.Repositories;

namespace AllergieAppBackend.Services
{
    public class RecipeService : IRecipeService
    {
        private readonly IRecipeRepository _repository;

        public RecipeService(IRecipeRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Recipe>> GetFilteredRecipesAsync(List<string> allergensToExclude)
        {
            return await _repository.GetRecipesFilteredByAllergensAsync(allergensToExclude);
        }
    }
}