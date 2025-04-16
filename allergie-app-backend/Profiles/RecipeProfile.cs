using AutoMapper;
using AllergieAppBackend.Models;
using AllergieAppBackend.DTOs;

namespace AllergieAppBackend.Profiles
{
    public class RecipeProfile : Profile
    {
        public RecipeProfile()
        {
            CreateMap<Recipe, RecipeDto>()
                .ForMember(dest => dest.IngredientNames,
                    opt => opt.MapFrom(src => src.Ingredients.Select(i => i.Name).ToList()));
        }
    }
}