using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniECommerceApi.Data;
using MiniECommerceApi.DTOs;
using MiniECommerceApi.Models;

namespace MiniECommerceApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CartController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // POST: /api/cart/add
        [HttpPost("add")]
        public async Task<ActionResult<CartDto>> AddToCart([FromBody] AddCartItemDto dto)
        {
            if (dto.Quantity <= 0)
                return BadRequest("Količina mora biti veća od 0.");

            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null)
                return NotFound("Proizvod nije pronađen.");

            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync();

            if (cart == null)
            {
                cart = new Cart();
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            var existingItem = cart.Items.FirstOrDefault(i => i.Product.Id == dto.ProductId);

            if (existingItem != null)
            {
                existingItem.Quantity += dto.Quantity;
            }
            else
            {
                var newItem = new CartItem
                {
                    Product = product,
                    Quantity = dto.Quantity
                };

                cart.Items.Add(newItem);
            }

            await _context.SaveChangesAsync();

            var cartDto = _mapper.Map<CartDto>(cart);
            return Ok(cartDto);
        }

        // GET: /api/cart
        [HttpGet]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync();

            if (cart == null || cart.Items.Count == 0)
                return NotFound("Korpa je prazna.");

            var cartDto = _mapper.Map<CartDto>(cart);
            return Ok(cartDto);
        }

        // PUT: /api/cart/item/{id}
        [HttpPut("item/{id}")]
        public async Task<ActionResult<CartDto>> UpdateItemQuantity(int id, [FromBody] int newQuantity)
        {
            if (newQuantity <= 0)
                return BadRequest("Količina mora biti veća od 0.");

            var cartItem = await _context.CartItems
                .Include(i => i.Product)
                .Include(i => i.Cart)
                .ThenInclude(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (cartItem == null)
                return NotFound("Stavka u korpi nije pronađena.");

            cartItem.Quantity = newQuantity;
            await _context.SaveChangesAsync();

            var cartDto = _mapper.Map<CartDto>(cartItem.Cart);
            return Ok(cartDto);
        }

        // DELETE: /api/cart/item/{id}
        [HttpDelete("item/{id}")]
        public async Task<ActionResult<CartDto>> RemoveItemFromCart(int id)
        {
            var cartItem = await _context.CartItems
                .Include(i => i.Cart)
                .ThenInclude(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (cartItem == null)
                return NotFound("Stavka u korpi nije pronađena.");

            var cart = cartItem.Cart;
            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            var cartDto = _mapper.Map<CartDto>(cart);
            return Ok(cartDto);
        }
    }
}
