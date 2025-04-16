using System.Collections.Generic;
using System.Threading.Tasks;
using AllergieAppBackend.Models;

namespace AllergieAppBackend.Repositories
{
    public interface IRecipeRepository
    {
        Task<List<Recipe>> GetRecipesFilteredByAllergensAsync(List<string> allergensToExclude);
    }
}