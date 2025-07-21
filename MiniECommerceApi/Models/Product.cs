using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiniECommerceApi.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public decimal Price { get; set; }

        public string ShortDescription { get; set; }

        public string FullDescription { get; set; }

        // lista URL-ova slika (iz json-a)
        [NotMapped]
        public List<string> Images { get; set; }

        
        [NotMapped]
        public Dictionary<string, string> TechnicalSpecifications { get; set; }
    }
}
