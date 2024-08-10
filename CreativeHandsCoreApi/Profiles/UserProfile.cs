using AutoMapper;
using CreativeHandsCoreApi.Entities.Sql.Authintication;
using MarketCoreGeneral.Models.Authintication;

namespace CreativeHandsCoreApi.Profiles
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<SqlUser, UserModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(dest => dest.Id))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(dest => dest.UserName))
                .ForMember(dest => dest.Password, opt => opt.MapFrom(dest => dest.Password))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(dest => dest.FullName))
                .ForMember(dest => dest.IsAdmin, opt => opt.MapFrom(dest => dest.IsAdmin));
        }
    }
}
