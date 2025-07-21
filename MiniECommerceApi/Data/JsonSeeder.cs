using System.Text.Json;
using MiniECommerceApi.Models;

namespace MiniECommerceApi.Data
{
    public static class JsonSeeder
    {
        public static void SeedFromJson(AppDbContext context)
        {
            if (context.Products.Any()) return;

            string jsonPath = Path.Combine("Data", "products.json");
            if (!File.Exists(jsonPath)) return;

            var json = File.ReadAllText(jsonPath);
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            var rawProducts = JsonSerializer.Deserialize<List<RawProduct>>(json, options);

            if (rawProducts != null)
            {
                var products = rawProducts.Select(rp => new Product
                {
                    Id = rp.Id,
                    Name = rp.Name,
                    Price = rp.Price,
                    ShortDescription = rp.ShortDescription,
                    FullDescription = rp.FullDescription
                    
                }).ToList();

                context.Products.AddRange(products);
                context.SaveChanges();
            }
        }


        // pomocna klasa za deserijalizaciju sa dodatnim poljima
        private class RawProduct
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public decimal Price { get; set; }
            public string ShortDescription { get; set; }
            public string FullDescription { get; set; }
            public List<string> Images { get; set; }
            public Dictionary<string, string> TechnicalSpecifications { get; set; }
        }
    }
}
