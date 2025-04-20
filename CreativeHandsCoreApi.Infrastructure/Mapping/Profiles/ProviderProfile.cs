using AutoMapper;
using CreativeHandsCoreApi.Infrastructure.Entities.Orders;
using MarketCoreGeneral.Models.Orders;

namespace CreativeHandsCoreApi.Infrastructure.Mapping.Profiles
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
