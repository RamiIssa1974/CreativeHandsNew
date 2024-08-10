using AutoMapper;
using CreativeHandsCoreApi.Entities.Sql.Authintication;
using CreativeHandsCoreApi.Entities.Sql.Orders;
using CreativeHandsCoreApi.Profiles.Resolvers;
using MarketCoreGeneral.Models.Authintication;
using MarketCoreGeneral.Models.Orders;
using MarketCoreGeneral.Models.Products;

namespace CreativeHandsCoreApi.Profiles
{
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            
            CreateMap<OrderModel, SqlOrder>();            
            CreateMap<SqlOrder,OrderModel >()
                .ForMember(dest => dest.Customer, opt => opt.MapFrom<CustomerResolver>())                
                .ForMember(dest => dest.OrderItems, opt => opt.MapFrom<OrderItemsResolver>());

            CreateMap<OrderItemModel, SqlOrderItem>();
            CreateMap<SqlOrderItem, OrderItemModel>()
                .ForMember(dest => dest.Product, opt => opt.MapFrom<OrderItemProductResolver>())
                .ForMember(dest => dest.ProductVariation, opt => opt.MapFrom<OrderItemProductVariationResolver>());

            CreateMap<ProviderModel, SqlProvider>();
            CreateMap<SqlProvider, ProviderModel>();

            CreateMap<PurchaseModel, SqlPurchase>();
            CreateMap<SqlPurchase,PurchaseModel>();

            CreateMap<SqlPurchaseImage, PurchaseImageModel>();
        }
    }
}
