using MarketCoreGeneral.Models.Orders;
using MarketCoreGeneral.Requests;
using MarketCoreGeneral.Responses;

namespace CreativeHandsCoreApi.Services
{
    public interface IUploadRepository
    {
        Task<UploadFilesResponse> UploadFile(IFormFile file, int productId);
        Task<UploadFilesResponse> UploadUmbracoFiles(List<IFormFile> files, int productId);
        Task<UploadFilesResponse> UploadPurchaseFile(IFormFile file, int purchaseId);
    }
}
