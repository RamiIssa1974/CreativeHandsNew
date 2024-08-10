using AutoMapper;
using CreativeHandsCoreApi.Entities.Sql.Authintication;
using CreativeHandsCoreApi.Entities.Sql.Orders;
using CreativeHandsCoreApi.Entities.Sql.Video;
using MarketCoreGeneral.Models.Authintication;
using MarketCoreGeneral.Models.Orders;
using MarketCoreGeneral.Models.Video;

namespace CreativeHandsCoreApi.Profiles
{
    public class VideoProfile : Profile
    {
        public VideoProfile()
        {
            CreateMap<SqlVideo, VideoModel>();
            CreateMap<VideoModel, SqlVideo>();
        }
    }
}
