using AllergieAppBackend.Models;

namespace AllergieAppBackend.Services
{
    public interface IRecipeService
    {
        Task<List<Recipe>> GetFilteredRecipesAsync(List<string> allergensToExclude);
    }
}