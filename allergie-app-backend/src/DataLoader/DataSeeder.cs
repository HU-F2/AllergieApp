using AllergieAppBackend.Data;
using AllergieAppBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace AllergieAppBackend.DataLoader
{
    public class DataSeeder
    {
        private readonly AppDbContext _context;

        public DataSeeder(AppDbContext context)
        {
            _context = context;
        }

        public void Seed()
        {
            _context.Database.Migrate();

            if (_context.Allergens.Any()) return; // Skip als al gevuld

            var gluten = new Allergen { Name = "Gluten" };
            var lactose = new Allergen { Name = "Lactose" };
            var noten = new Allergen { Name = "Noten" };

            var melk = new Ingredient { Name = "Melk", Allergens = new List<Allergen> { lactose } };
            var ei = new Ingredient { Name = "Ei" };
            var pinda = new Ingredient { Name = "Pinda", Allergens = new List<Allergen> { noten } };
            var bloem = new Ingredient { Name = "Bloem", Allergens = new List<Allergen> { gluten } };
            var suiker = new Ingredient { Name = "Suiker" };

            var pannenkoeken = new Recipe
            {
                Name = "Pannenkoeken",
                Description = "Lekkere Hollandse pannenkoeken.",
                Ingredients = new List<Ingredient> { bloem, melk, ei }
            };

            var pindakoekjes = new Recipe
            {
                Name = "Pindakoekjes",
                Description = "Knapperige koekjes met pinda’s.",
                Ingredients = new List<Ingredient> { suiker, pinda, bloem }
            };

            var omelet = new Recipe
            {
                Name = "Omelet",
                Description = "Snel en voedzaam.",
                Ingredients = new List<Ingredient> { ei, melk }
            };

            _context.Allergens.AddRange(gluten, lactose, noten);
            _context.Ingredients.AddRange(melk, ei, pinda, bloem, suiker);
            _context.Recipes.AddRange(pannenkoeken, pindakoekjes, omelet);

            _context.SaveChanges();
        }
    }
}