using System.Collections.Generic;

namespace AllergieAppBackend.DTOs
{
    public class RecipeDto
    {
        public required string Name { get; set; }
        public string Description { get; set; } = string.Empty;
        public List<string> IngredientNames { get; set; } = new List<String>();
    }
}