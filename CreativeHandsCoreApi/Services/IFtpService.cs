using MarketCoreGeneral.Models.Authintication;
using MarketCoreGeneral.Requests;

namespace CreativeHandsCoreApi.Services
{
    public interface IFtpService
    {
        Task<string> UploadToFTP(IFormFile fileToUpload, string fileName, string imagespath);
        Task<bool> DeleteFileFromFTP(string fileName, string folder);

        Task<List<string>> DeleteFilesFromFTP(List<string> fileNames, string folder, int maxRetries = 3);
         Task<List<string>> ListFilesFromFTP(string folder, int productId);
    }
}
