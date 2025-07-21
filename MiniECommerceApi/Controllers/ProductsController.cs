using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniECommerceApi.Data;
using MiniECommerceApi.DTOs;
using MiniECommerceApi.Models;
using System.Text.Json;

namespace MiniECommerceApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductsController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: /api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll()
        {
            var products = await _context.Products.ToListAsync();

            var productDtos = products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                ShortDescription = p.ShortDescription,
                FullDescription = p.FullDescription,
                Images = GetImagesForProduct(p.Id),
                TechnicalSpecifications = GetSpecsForProduct(p.Id)
            }).ToList();

            return Ok(productDtos);
        }

        // GET: /api/products/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetById(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound();

            var dto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                ShortDescription = product.ShortDescription,
                FullDescription = product.FullDescription,
                Images = GetImagesForProduct(product.Id),
                TechnicalSpecifications = GetSpecsForProduct(product.Id)
            };

            return Ok(dto);
        }

        private List<string> GetImagesForProduct(int productId)
        {
            var folderPath = Path.Combine(_env.WebRootPath, "images", $"product_{productId}");

            if (!Directory.Exists(folderPath))
                return new List<string>();

            return Directory.GetFiles(folderPath)
                .OrderBy(f => f) 
                .Select(file =>
                    Path.Combine("images", $"product_{productId}", Path.GetFileName(file))
                        .Replace("\\", "/"))
                .ToList();
        }

        private Dictionary<string, string> GetSpecsForProduct(int productId)
        {
            var specPath = Path.Combine(_env.WebRootPath, "specs", $"product_{productId}.json");

            if (!System.IO.File.Exists(specPath))
                return new Dictionary<string, string>();

            try
            {
                var json = System.IO.File.ReadAllText(specPath);
                return JsonSerializer.Deserialize<Dictionary<string, string>>(json) ?? new Dictionary<string, string>();
            }
            catch
            {
                return new Dictionary<string, string>();
            }
        }
    }
}
