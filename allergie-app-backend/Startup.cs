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

			services.AddCors(options =>
			{
				options.AddPolicy("AllowElectron", builder =>
				{
					builder
						.WithOrigins("http://localhost:4000")
						.AllowAnyHeader()
						.AllowAnyMethod();
						// .AllowCredentials();
				});
			});

			services.AddCors(options =>
			{
				options.AddPolicy("AllowAll", builder =>
				{
					builder
						.AllowAnyOrigin()
						.AllowAnyHeader()
						.AllowAnyMethod();
				});
			});
		}

		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
				app.UseSwagger();
				app.UseSwaggerUI(c =>
				{
					c.SwaggerEndpoint("/swagger/v1/swagger.json", "Allergie API V1");
					c.RoutePrefix = "swagger";
				});
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

			// app.UseHttpsRedirection();
			app.UseRouting();
			app.UseCors("AllowAll");
			// app.UseCors("AllowElectron");
			app.Use(async (context, next) =>
			{
				if (context.Request.Method == "OPTIONS")
				{
					context.Response.StatusCode = 204;
					return;
				}
				await next();
			});
			app.UseAuthorization();
			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
			});
		}
	}
}