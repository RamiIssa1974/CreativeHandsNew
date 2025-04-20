using AutoMapper;
using CreativeHandsCoreApi.Infrastructure.Entities.Orders;
using CreativeHandsCoreApi.Infrastructure.Persistence;
using MarketCoreGeneral.Models.Orders;
using MarketCoreGeneral.Models.Products;

namespace CreativeHandsCoreApi.Infrastructure.Mapping.Resolvers
{
    public class OrderItemProductResolver : IValueResolver<SqlOrderItem, OrderItemModel, ProductModel>
    {
        private readonly MarketContext _dbContext; // Replace YourDatabaseContext with your actual DbContext type
        private readonly IMapper _mapper;
        public OrderItemProductResolver(MarketContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public ProductModel Resolve(SqlOrderItem source, OrderItemModel destination, ProductModel destMember, ResolutionContext context)
        {
            // Load the customer from the database using the CustomerId from the source object
            var dbProduct = _dbContext.Product.FirstOrDefault(pr => pr.Id == source.ProductId);
            var product = _mapper.Map<ProductModel>(dbProduct);

            return product;
        }
    }
}
