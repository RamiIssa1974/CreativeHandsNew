using MarketCoreGeneral.Responses;
using Microsoft.AspNetCore.Http;

namespace CreativeHandsCoreApi.Domain.Repositories
{
    public interface IUploadRepository
    {
        Task<UploadFilesResponse> UploadFile(IFormFile file, int productId);
        Task<UploadFilesResponse> UploadUmbracoFiles(List<IFormFile> files, int productId);
        Task<UploadFilesResponse> UploadPurchaseFile(IFormFile file, int purchaseId);
    }
}
