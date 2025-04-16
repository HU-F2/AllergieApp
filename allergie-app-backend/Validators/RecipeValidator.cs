using FluentValidation;
using AllergieAppBackend.DTOs;

namespace AllergieAppBackend.Validators
{
    public class RecipeValidator : AbstractValidator<RecipeDto>
    {
        public RecipeValidator()
        {
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
        }
    }
}