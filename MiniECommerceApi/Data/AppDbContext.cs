using Microsoft.EntityFrameworkCore;
using MiniECommerceApi.Models;

namespace MiniECommerceApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // DbSet za entitete
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Cart> Carts => Set<Cart>();
        public DbSet<CartItem> CartItems => Set<CartItem>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // relacije: jedan Cart ima više CartItema
            modelBuilder.Entity<Cart>()
                .HasMany(c => c.Items)
                .WithOne(i => i.Cart)
                .HasForeignKey(i => i.CartId)
                .OnDelete(DeleteBehavior.Cascade); // ako se korpa obrise, brisu se i stavke

            // default vrednost za quantity
            modelBuilder.Entity<CartItem>()
                .Property(i => i.Quantity)
                .HasDefaultValue(1);
        }
    }
}
