using AutoMapper;
using CreativeHandsCoreApi.DbContexts;
using CreativeHandsCoreApi.Entities.Sql.Customers;
using CreativeHandsCoreApi.Entities.Sql.Orders;
using CreativeHandsCoreApi.Entities.Sql.Products;
using MarketCoreGeneral.Models.Customers;
using MarketCoreGeneral.Models.Orders;
using MarketCoreGeneral.Models.Products;

namespace CreativeHandsCoreApi.Profiles.Resolvers
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
