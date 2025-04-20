using MarketCoreGeneral.Models.Authintication;
using MarketCoreGeneral.Requests;
using Microsoft.AspNetCore.Http;

namespace CreativeHandsCoreApi.Infrastructure.Services.Ftp
{
    public interface IFtpService
    {
        Task<string> UploadToFTP(IFormFile fileToUpload, string fileName, string imagespath);
        Task<bool> DeleteFileFromFTP(string fileName, string folder);

        Task<List<string>> DeleteFilesFromFTP(List<string> fileNames, string folder, int maxRetries = 3);
         Task<List<string>> ListFilesFromFTP(string folder, int productId);
    }
}
