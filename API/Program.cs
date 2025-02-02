
using API.Middleware;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();

            builder.Services.AddDbContext<StoreContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
            });

            builder.Services.AddSingleton<IConnectionMultiplexer>(config =>
            {
                var connectionString = builder.Configuration.GetConnectionString("Redis")
                ?? throw new Exception("Cannot get redis connection string");
                var configuration = ConfigurationOptions.Parse(connectionString, true);
                return ConnectionMultiplexer.Connect(configuration);
                
            });

            builder.Services.AddSingleton<ICartService, CartService>();

            builder.Services.AddIdentityApiEndpoints<AppUser>()
                .AddEntityFrameworkStores<StoreContext>();

            builder.Services.AddScoped<IProductRepository, ProductRepository>();
            builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>)); //dependancy injection of generic services.
            builder.Services.AddCors();

            var app = builder.Build();

            app.UseMiddleware<ExceptionMiddleware>();
            
            app.UseCors(x => 
            x.AllowAnyHeader().AllowAnyMethod().AllowCredentials()
            .WithOrigins("http://localhost:4200","https://localhost:4200")
            );

            app.MapControllers();
            app.MapGroup("api").MapIdentityApi<AppUser>();  //api/register

            try
            {
                using var scope = app.Services.CreateScope();
                var service = scope.ServiceProvider;
                var context = service.GetRequiredService<StoreContext>();
                await context.Database.MigrateAsync();
                await StoreContextSeed.SeedAsync(context);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            app.Run();
        }
    }
}
