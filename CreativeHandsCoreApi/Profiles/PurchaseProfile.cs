using AutoMapper;
using CreativeHandsCoreApi.Entities.Sql.Authintication;
using CreativeHandsCoreApi.Entities.Sql.Orders;
using MarketCoreGeneral.Models.Authintication;
using MarketCoreGeneral.Models.Orders;

namespace CreativeHandsCoreApi.Profiles
{
    public class PurchaseProfile : Profile
    {
        public PurchaseProfile()
        {
            CreateMap<SqlPurchase, PurchaseModel>()
             .ForMember(dest => dest.CreateDate, opt => opt.MapFrom(src => src.Date.ToString("yyyy-MM-dd HH:mm:ss.fff")));

            CreateMap<PurchaseModel, SqlPurchase>()
            .ForMember(dest => dest.Date, opt => opt.MapFrom(src =>
                DateTime.ParseExact(src.CreateDate, "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture)));


        }
    }
}
