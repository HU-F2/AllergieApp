using AllergieAppBackend.Models;

namespace AllergieAppBackend.Services
{
    public class IngredientCheckService : IIngredientCheckService
    {
        private readonly List<string> _knownAllergens = new()
        {
            "gluten", "noten", "lactose", "soja", "schaaldieren"
        };

        public IngredientCheckResult Check(List<string> ingredients)
        {
            var found = ingredients
                .Where(i => _knownAllergens.Contains(i.ToLowerInvariant()))
                .Distinct()
                .ToList();

            return new IngredientCheckResult { DetectedAllergens = found };
        }
    }
}