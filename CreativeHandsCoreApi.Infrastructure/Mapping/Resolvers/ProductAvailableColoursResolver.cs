using AutoMapper;
using CreativeHandsCoreApi.Infrastructure.Entities.Products;
using CreativeHandsCoreApi.Infrastructure.Persistence;
using MarketCoreGeneral.Models.Products;

namespace CreativeHandsCoreApi.Infrastructure.Mapping.Resolvers
{
    public class ProductAvailableColoursResolver : IValueResolver<SqlProduct, ProductModel, List<ProductColourModel>>
    {
        private readonly MarketContext _dbContext; // Replace YourDatabaseContext with your actual DbContext type
        private readonly IMapper _mapper;
        public ProductAvailableColoursResolver(MarketContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public List<ProductColourModel> Resolve(SqlProduct source, ProductModel destination, List<ProductColourModel> destMember, ResolutionContext context)
        {            
            var dbColours = _dbContext.ProductAvailableColours.Where(pr => pr.ProductId == source.Id);
            
            var productColours = _mapper.Map<List<ProductColourModel>>(dbColours);

            return productColours;
        }
    }
}
