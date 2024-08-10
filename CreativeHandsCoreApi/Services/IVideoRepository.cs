using MarketCoreGeneral.Models.Orders;
using MarketCoreGeneral.Models.Video;
using MarketCoreGeneral.Requests;
using MarketCoreGeneral.Responses;

namespace CreativeHandsCoreApi.Services
{
    public interface IVideoRepository
    {        
        Task<IEnumerable<VideoModel>> GetVideos(VideoModel purchaseId);

        Task<UploadFilesResponse> SaveVideo(IFormFile file, VideoModel request);         
    }
}
