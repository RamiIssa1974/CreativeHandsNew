using AutoMapper;
using CreativeHandsCoreApi.DbContexts;
using CreativeHandsCoreApi.Entities.Sql.Customers;
using CreativeHandsCoreApi.Entities.Sql.Orders;
using MarketCoreGeneral.Models.Customers;
using MarketCoreGeneral.Models.Orders;

namespace CreativeHandsCoreApi.Profiles.Resolvers
{
    public class OrderItemsResolver : IValueResolver<SqlOrder, OrderModel, List<OrderItemModel>>
    {
        private readonly MarketContext _dbContext; // Replace YourDatabaseContext with your actual DbContext type
        private readonly IMapper _mapper;
        public OrderItemsResolver(MarketContext dbContext, IMapper mapper )
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public List<OrderItemModel> Resolve(SqlOrder source,OrderModel  destination, List<OrderItemModel> destMember, ResolutionContext context)
        {
            // Load the customer from the database using the CustomerId from the source object
            var dbOrderItems = _dbContext.OrderItem.Where(c => c.OrderId == source.Id);
            var itemsModel = _mapper.Map<IEnumerable<OrderItemModel>>(dbOrderItems);
             
            return itemsModel.ToList();
        }

         
    }
}
