
namespace AllergieAppBackend.Models
{
	public class IngredientAllergen
	{
		public int IngredientId { get; set; }
		public Ingredient Ingredient { get; set; } = default!;

		public int AllergenId { get; set; }
		public Allergen Allergen { get; set; } = default!;
	}
}