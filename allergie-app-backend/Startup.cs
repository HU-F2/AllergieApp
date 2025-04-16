using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
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
            // services.AddControllers()
            //     .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<RecipeValidator>());

            services.AddFluentValidationAutoValidation()
                    .AddFluentValidationClientsideAdapters();

            services.AddValidatorsFromAssemblyContaining<RecipeValidator>();

            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

            // services.AddAutoMapper(typeof(RecipeProfile));
            services.AddAutoMapper(typeof(RecipeProfile).Assembly);

            services.AddScoped<IRecipeRepository, RecipeRepository>();
            services.AddScoped<IRecipeService, RecipeService>();
            services.AddScoped<DataSeeder>();

            services.AddSwaggerGen();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            using var scope = app.ApplicationServices.CreateScope();
            var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
            seeder.Seed();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}