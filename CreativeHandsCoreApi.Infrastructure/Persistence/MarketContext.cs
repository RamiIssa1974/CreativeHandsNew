

using CreativeHandsCoreApi.Entities.Authintication;
using CreativeHandsCoreApi.Infrastructure.Entities;
using CreativeHandsCoreApi.Infrastructure.Entities.Customers;
using CreativeHandsCoreApi.Infrastructure.Entities.Orders;
using CreativeHandsCoreApi.Infrastructure.Entities.Products;
using CreativeHandsCoreApi.Infrastructure.Entities.Video;
using Microsoft.EntityFrameworkCore;

namespace CreativeHandsCoreApi.Infrastructure.Persistence
{
    public class MarketContext : DbContext
    {
        public MarketContext(DbContextOptions<MarketContext> options)
           : base(options)
        {

        }

        public DbSet<SqlUser> User { get; set; } = null!;
        public DbSet<SqlCategory> Category { get; set; } = null!;
         public DbSet<SqlCatSubCat> CatSubCat { get; set; } = null!;
        public DbSet<SqlCustomer> Customer { get; set; } = null!;
        public DbSet<SqlImage> Image { get; set; } = null!;
        public DbSet<SqlLog> Log { get; set; } = null!;
        public DbSet<SqlOrder> Order { get; set; } = null!;
        public DbSet<SqlOrderItem> OrderItem { get; set; } = null!;
        public DbSet<SqlOrderItemColour> OrderItemColour { get; set; } = null!;
        public DbSet<SqlProduct> Product { get; set; } = null!;
        public DbSet<SqlProductAvailableColours> ProductAvailableColours { get; set; } = null!;
        public DbSet<SqlProductCategory> ProductCategory { get; set; } = null!;
        public DbSet<SqlProductVariation> ProductVariation { get; set; } = null!;
        public DbSet<SqlProvider> Provider { get; set; } = null!;
        public DbSet<SqlPurchase> Purchase { get; set; } = null!;
        public DbSet<SqlPurchaseImage> PurchaseImage { get; set; } = null!;
        public DbSet<SqlVideo> Video { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer();
                base.OnConfiguring(optionsBuilder);
            }            
        }
    }

}
