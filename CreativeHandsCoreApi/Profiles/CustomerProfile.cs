using AutoMapper;
using CreativeHandsCoreApi.Entities.Sql.Authintication;
using CreativeHandsCoreApi.Entities.Sql.Customers;
using MarketCoreGeneral.Models.Authintication;
using MarketCoreGeneral.Models.Customers;

namespace CreativeHandsCoreApi.Profiles
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
