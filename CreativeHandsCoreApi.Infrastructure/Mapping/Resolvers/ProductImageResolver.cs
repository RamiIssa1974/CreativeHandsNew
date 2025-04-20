using AutoMapper;
using CreativeHandsCoreApi.Infrastructure.Entities.Products;
using CreativeHandsCoreApi.Infrastructure.Persistence;
using MarketCoreGeneral.Models.Products;

namespace CreativeHandsCoreApi.Infrastructure.Mapping.Resolvers
{
    public class ProductImageResolver : IValueResolver<SqlProduct, ProductModel, List<ProductImageModel>>
    {
        private readonly MarketContext _dbContext; // Replace YourDatabaseContext with your actual DbContext type
        private readonly IMapper _mapper;
        public ProductImageResolver(MarketContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public List<ProductImageModel> Resolve(SqlProduct source, ProductModel destination, List<ProductImageModel> destMember, ResolutionContext context)
        {            
            var dbImages = _dbContext.Image.Where(pr => pr.ProductId == source.Id);
            
            var productImages = _mapper.Map<List<ProductImageModel>>(dbImages);

            return productImages;
        }
    }
}
