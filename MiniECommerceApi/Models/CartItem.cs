using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiniECommerceApi.Models
{
    public class CartItem
    {
        [Key]
        public int Id { get; set; }

        public int Quantity { get; set; }

    
        public int ProductId { get; set; }
        public Product Product { get; set; }

    
        public int CartId { get; set; }
        public Cart Cart { get; set; }
    }
}
