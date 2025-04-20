using MarketCoreGeneral.Models.Video;
using MarketCoreGeneral.Responses;
using Microsoft.AspNetCore.Http;

namespace CreativeHandsCoreApi.Domain.Repositories
{
    public interface IVideoRepository
    {
        Task<bool> DeleteVideo(int videoId);
        Task<IEnumerable<VideoModel>> GetVideos(VideoModel purchaseId);

        Task<UploadFilesResponse> SaveVideo(IFormFile file, VideoModel request);         
    }
}
