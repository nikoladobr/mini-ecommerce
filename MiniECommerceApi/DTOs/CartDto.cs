namespace MiniECommerceApi.DTOs
{
    public class CartDto
    {
        public int Id { get; set; }

        public List<CartItemDto> Items { get; set; } = new();

        public decimal Total => Items.Sum(i => i.Total);

        public DateTime CreatedAt { get; set; }
    }
}
