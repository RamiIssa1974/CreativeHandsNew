using AutoMapper;
using CreativeHandsCoreApi.Entities.Sql;
using CreativeHandsCoreApi.Entities.Sql.Authintication;
using CreativeHandsCoreApi.Entities.Sql.Products;
using CreativeHandsCoreApi.Profiles.Resolvers;
using MarketCoreGeneral.Models.Authintication;
using MarketCoreGeneral.Models.Orders;
using MarketCoreGeneral.Models.Products;

namespace CreativeHandsCoreApi.Profiles
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<CategoryModel, SqlCategory>();
            CreateMap<SqlCategory, CategoryModel>();
            
            CreateMap<SqlProduct, ProductModel>()
                .ForMember(dest => dest.Categories, opt => opt.MapFrom<ProductCategoryResolver>())
                .ForMember(dest => dest.ProductVariations, opt => opt.MapFrom<ProductProductVariationResolver>())
                .ForMember(dest => dest.Images, opt => opt.MapFrom<ProductImageResolver>())
                .ForMember(dest => dest.AvailableColours, opt => opt.MapFrom<ProductAvailableColoursResolver>());

            CreateMap<ProductModel, SqlProduct>();

            CreateMap<SqlProductVariation, ProductVariationModel>();
            CreateMap<ProductVariationModel, SqlProductVariation>();

            CreateMap<SqlProductCategory, ProductCategoryModel>();
            CreateMap<SqlProductAvailableColours, ProductColourModel>();            
            CreateMap<SqlImage, ProductImageModel>();
        }
    }
}
