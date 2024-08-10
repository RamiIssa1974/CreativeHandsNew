using AutoMapper;
using CreativeHandsCoreApi.DbContexts;
using CreativeHandsCoreApi.Entities.Sql;
using CreativeHandsCoreApi.Entities.Sql.Customers;
using CreativeHandsCoreApi.Entities.Sql.Orders;
using CreativeHandsCoreApi.Entities.Sql.Products;
using MarketCoreGeneral.Models.Customers;
using MarketCoreGeneral.Models.Orders;
using MarketCoreGeneral.Models.Products;

namespace CreativeHandsCoreApi.Profiles.Resolvers
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
