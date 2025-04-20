using AutoMapper;
using CreativeHandsCoreApi.Infrastructure.Entities.Customers;
using MarketCoreGeneral.Models.Authintication;
using MarketCoreGeneral.Models.Customers;

namespace CreativeHandsCoreApi.Infrastructure.Mapping.Profiles
{
    public class CustomerProfile : Profile
    {
        public CustomerProfile()
        {
            CreateMap<SqlCustomer, CustomerModel>();
            CreateMap<CustomerModel, SqlCustomer>();
        }
    }
}
