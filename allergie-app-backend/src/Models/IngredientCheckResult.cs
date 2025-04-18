namespace AllergieAppBackend.Models
{
    public class IngredientCheckResult
    {
        public List<string> DetectedAllergens { get; set; } = new List<string>();
    }
}