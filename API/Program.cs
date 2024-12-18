
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

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

            builder.Services.AddScoped<IProductRepository, ProductRepository>();

            var app = builder.Build();

            app.MapControllers();

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
