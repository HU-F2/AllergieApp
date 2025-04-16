using AllergieAppBackend.Models;

namespace AllergieAppBackend.Services
{
    public interface IIngredientCheckService
    {
        IngredientCheckResult Check(List<string> ingredients);
    }
}