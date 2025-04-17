using Microsoft.EntityFrameworkCore;
using FluentValidation.AspNetCore;
using AllergieAppBackend.Data;
using AllergieAppBackend.Services;
using AllergieAppBackend.Repositories;
using AllergieAppBackend.Profiles;
using AllergieAppBackend.Validators;
using AllergieAppBackend.DataLoader;
using FluentValidation;

namespace AllergieAppBackend
{
	public class Startup
	{
		public IConfiguration Configuration { get; }

		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public void ConfigureServices(IServiceCollection services)
		{
			services.AddControllers();

			services.AddFluentValidationAutoValidation()
					.AddFluentValidationClientsideAdapters();

			services.AddValidatorsFromAssemblyContaining<RecipeValidator>();

			services.AddEndpointsApiExplorer();
			services.AddSwaggerGen();

			services.AddDbContext<AppDbContext>(options =>
				options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

			services.AddAutoMapper(typeof(RecipeProfile).Assembly);

			services.AddScoped<IRecipeRepository, RecipeRepository>();
			services.AddScoped<IRecipeService, RecipeService>();
			services.AddScoped<DataSeeder>();
		}

		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
				app.UseSwagger();
				app.UseSwaggerUI();
			}

			using (var scope = app.ApplicationServices.CreateScope())
			{
				var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
				var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();

				Console.WriteLine("Environment: " + env.EnvironmentName);
				if (env.IsDevelopment())
				{
					dbContext.Database.EnsureDeletedAsync();
					dbContext.Database.Migrate();
					seeder.Seed();
				}
				else
				{
					dbContext.Database.EnsureCreatedAsync();
					if (!dbContext.Recipes.Any())
					{
						seeder.Seed();
					}
				}
			}

			// app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

			app.UseHttpsRedirection();
			app.UseRouting();
			app.UseAuthorization();
			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
			});
		}
	}
}