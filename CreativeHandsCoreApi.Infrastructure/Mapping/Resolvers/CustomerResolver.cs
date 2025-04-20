using AutoMapper;
using CreativeHandsCoreApi.Infrastructure.Entities.Orders;
using CreativeHandsCoreApi.Infrastructure.Persistence;
using MarketCoreGeneral.Models.Customers;
using MarketCoreGeneral.Models.Orders;

namespace CreativeHandsCoreApi.Profiles.Resolvers
{
    public class CustomerResolver : IValueResolver<SqlOrder, OrderModel, CustomerModel>
    {
        private readonly MarketContext _dbContext; // Replace YourDatabaseContext with your actual DbContext type
        private readonly IMapper _mapper;
        public CustomerResolver(MarketContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public CustomerModel Resolve(SqlOrder source, OrderModel destination, CustomerModel destMember, ResolutionContext context)
        {
            // Load the customer from the database using the CustomerId from the source object
            var dbCustomer = _dbContext.Customer.FirstOrDefault(c => c.Id == source.CustomerId);
            var customer = _mapper.Map<CustomerModel>(dbCustomer);

            return customer;
        }
    }
}
