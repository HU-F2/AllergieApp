using Xunit;
using Moq;
using AllergieAppBackend.Services;
using AllergieAppBackend.Repositories;
using AllergieAppBackend.Models;

namespace AllergieAppBackend.Tests
{
    public class RecipeServiceTests
    {
        [Fact]
        public async Task GetFilteredRecipesAsync_ReturnsFilteredRecipes()
        {
            var mockRepo = new Mock<IRecipeRepository>();
            mockRepo.Setup(repo => repo.GetRecipesFilteredByAllergensAsync(It.IsAny<List<string>>()))
                    .ReturnsAsync(new List<Recipe> { new Recipe { Id = 1, Name = "Test", Description = "Test desc", Ingredients = new() } });

            var service = new RecipeService(mockRepo.Object);
            var result = await service.GetFilteredRecipesAsync(new List<string> { "gluten" });

            Assert.Single(result);
        }
    }
}