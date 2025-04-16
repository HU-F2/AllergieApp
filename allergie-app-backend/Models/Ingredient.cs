namespace AllergieAppBackend.Models
{
    public class Ingredient
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public List<Allergen> Allergens { get; set; } = new List<Allergen>();
    }
}