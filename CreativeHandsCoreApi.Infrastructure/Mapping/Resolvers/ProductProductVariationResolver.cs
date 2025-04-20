using AutoMapper;
using CreativeHandsCoreApi.Infrastructure.Entities.Products;
using CreativeHandsCoreApi.Infrastructure.Persistence;
using MarketCoreGeneral.Models.Customers;
using MarketCoreGeneral.Models.Orders;
using MarketCoreGeneral.Models.Products;

namespace CreativeHandsCoreApi.Infrastructure.Mapping.Resolvers
{
    public class ProductProductVariationResolver : IValueResolver<SqlProduct, ProductModel, List<ProductVariationModel>>
    {
        private readonly MarketContext _dbContext; // Replace YourDatabaseContext with your actual DbContext type
        private readonly IMapper _mapper;
        public ProductProductVariationResolver(MarketContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public List<ProductVariationModel> Resolve(SqlProduct source, ProductModel destination, List<ProductVariationModel> destMember, ResolutionContext context)
        {            
            var dbProductVariation = _dbContext.ProductVariation.Where(pr => pr.ProductId == source.Id);
            var productVars = _mapper.Map<List<ProductVariationModel>>(dbProductVariation);

            return   productVars;
        }
    }
}
