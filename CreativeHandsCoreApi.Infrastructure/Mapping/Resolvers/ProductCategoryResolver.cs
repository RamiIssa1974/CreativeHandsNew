using AutoMapper;
using CreativeHandsCoreApi.Infrastructure.Entities.Products;
using CreativeHandsCoreApi.Infrastructure.Persistence;
using MarketCoreGeneral.Models.Products;

namespace CreativeHandsCoreApi.Infrastructure.Mapping.Resolvers
{
    public class ProductCategoryResolver : IValueResolver<SqlProduct, ProductModel, List<CategoryModel>>
    {
        private readonly MarketContext _dbContext; // Replace YourDatabaseContext with your actual DbContext type
        private readonly IMapper _mapper;
        public ProductCategoryResolver(MarketContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public List<CategoryModel> Resolve(SqlProduct source, ProductModel destination, List<CategoryModel> destMember, ResolutionContext context)
        {            
            var dbProductCatsIds = _dbContext.ProductCategory.Where(pr => pr.ProductId == source.Id).Select(pc=>pc.CategoryId);
            var dbProductCats = _dbContext.Category.Where(cat => dbProductCatsIds.Contains(cat.Id));
            var productVars = _mapper.Map<List<CategoryModel>>(dbProductCats);

            return productVars;
        }
    }
}
