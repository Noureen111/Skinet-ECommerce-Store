
using Core.Entities;
using System.Text.Json;

namespace Infrastructure.Data
{
    public class StoreContextSeed()
    {
        public static async Task SeedAsync(StoreContext context)
        {
            if(!context.Products.Any())
            {
                var productsData = await File.ReadAllTextAsync("../infrastructure/Data/SeedData/products.json");
                var products = JsonSerializer.Deserialize<List<Product>>(productsData);

                if (products == null) return;
                
                context.AddRange(products);
                await context.SaveChangesAsync();
            }
        }
    }
}
