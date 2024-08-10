using MarketCoreGeneral.Models.Authintication;
using MarketCoreGeneral.Requests;

namespace CreativeHandsCoreApi.Services
{
    public interface IFtpService
    {
        Task<string> UploadToFTP(IFormFile fileToUpload, string fileName, string imagespath);
        //Task<string> UploadPurchaseFileToFTP(IFormFile fileToUpload, int productId);
    }
}
