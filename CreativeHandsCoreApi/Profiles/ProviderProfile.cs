using AutoMapper;
using CreativeHandsCoreApi.Entities.Sql.Authintication;
using CreativeHandsCoreApi.Entities.Sql.Orders;
using MarketCoreGeneral.Models.Authintication;
using MarketCoreGeneral.Models.Orders;

namespace CreativeHandsCoreApi.Profiles
{
    public class ProviderProfile : Profile
    {
        public ProviderProfile()
        {
            CreateMap<SqlProvider, ProviderModel>();
            CreateMap<ProviderModel, SqlProvider>();
        }
    }
}
