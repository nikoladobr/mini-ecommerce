namespace MiniECommerceApi.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public decimal Price { get; set; }

        public string ShortDescription { get; set; }

        public string FullDescription { get; set; }

        public List<string> Images { get; set; } = new();

        public Dictionary<string, string> TechnicalSpecifications { get; set; } = new();
    }
}
