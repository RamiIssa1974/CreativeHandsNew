using AutoMapper;
using CreativeHandsCoreApi.Infrastructure.Entities.Video;
using MarketCoreGeneral.Models.Video;

namespace CreativeHandsCoreApi.Infrastructure.Mapping.Profiles
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
