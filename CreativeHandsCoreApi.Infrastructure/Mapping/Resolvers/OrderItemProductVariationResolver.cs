using AutoMapper;
using CreativeHandsCoreApi.Infrastructure.Entities.Orders;
using CreativeHandsCoreApi.Infrastructure.Persistence;
using MarketCoreGeneral.Models.Orders;
using MarketCoreGeneral.Models.Products;

namespace CreativeHandsCoreApi.Infrastructure.Mapping.Resolvers
{
    public class OrderItemProductVariationResolver : IValueResolver<SqlOrderItem, OrderItemModel, ProductVariationModel>
    {
        private readonly MarketContext _dbContext; // Replace YourDatabaseContext with your actual DbContext type
        private readonly IMapper _mapper;
        public OrderItemProductVariationResolver(MarketContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public ProductVariationModel Resolve(SqlOrderItem source, OrderItemModel destination, ProductVariationModel destMember, ResolutionContext context)
        {
            // Load the customer from the database using the CustomerId from the source object
            var dbProductVariation = _dbContext.ProductVariation.FirstOrDefault(pr => pr.Id == source.ProductVariationId);
            var productVar = _mapper.Map<ProductVariationModel>(dbProductVariation);

            return productVar;
        }
    }
}
