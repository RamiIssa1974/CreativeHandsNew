using AutoMapper;
using CreativeHandsCoreApi.Infrastructure.Persistence;
using CreativeHandsCoreApi.Infrastructure.Repositories;
using MarketCoreGeneral.Models.Authintication;
using MarketCoreGeneral.Requests;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Concurrent;
using System.Net;
 




namespace CreativeHandsCoreApi.Infrastructure.Services.Ftp
{
    public class FtpService : IFtpService
    {
        private ILogger<SqlMarketRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly MarketContext _context;
        private readonly HttpContent? httpContent;
        private readonly HttpClient httpClient;
        private readonly FtpSettings _ftpSettings;

        public FtpService(MarketContext context,
            ILogger<SqlMarketRepository> logger,
            IConfiguration configuration,
            IMapper mapper,
            IOptions<FtpSettings> ftpSettings)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper;
            _configuration = configuration;
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _ftpSettings = ftpSettings.Value;
        }



        public async Task<string> UploadToFTP(IFormFile fileToUpload, string fileName,string ImagesPath )
        {
            
            var contentLength = 0;
            string uploadUrl = _ftpSettings.UploadUrl+ImagesPath;
            string ftpUserName = _ftpSettings.UserName;
            string ftpPassword = _ftpSettings.Password;

            try
            {
               
                // Get the object used to communicate with the server.
                var UriString = uploadUrl + @"/" + fileName;
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(UriString);
                request.Method = WebRequestMethods.Ftp.UploadFile;
                request.Credentials = new NetworkCredential(ftpUserName, ftpPassword);
                request.UsePassive = true;
                request.UseBinary = true;
                request.KeepAlive = false;
                request.EnableSsl = false;

                // Read file contents into a byte array
                using (MemoryStream ms = new MemoryStream())
                {
                    await fileToUpload.CopyToAsync(ms);
                    byte[] buffer = ms.ToArray();

                    // Upload the file to FTP
                    request.ContentLength = buffer.Length;
                    using (Stream requestStream = request.GetRequestStream())
                    {
                        await requestStream.WriteAsync(buffer, 0, buffer.Length);
                    }
                }

                return fileName;

            }
            catch (WebException e)
            {
                // Handle exceptions
                var status = ((FtpWebResponse)e.Response).StatusDescription;
                var requestData = string.Format("fileName: {0},contentLength: {1}", fileName, contentLength);
                _logger.LogError("FtpService.UploadToFTP", requestData);
                return "";
            }
            catch (Exception ex)
            {
                // Handle exceptions
                var requestData = string.Format("fileName: {0},contentLength: {1}", fileName, contentLength);
                _logger.LogError("FtpService.UploadToFTP", ex.Message, requestData);
                return "";
            }
        }

        public async Task<string> UploadPurchaseFileToFTP(IFormFile fileToUpload, int purchaseId)
        {
            var fileName = "";
            var contentLength = 0;
           
            string uploadUrl = _ftpSettings.UploadUrl+ "Purchases";
            string ftpUserName = _ftpSettings.UserName;
            string ftpPassword = _ftpSettings.Password;
            try
            {
                string fileNameExtension = Path.GetExtension(fileToUpload.FileName);
                var purchaImage = _context.PurchaseImage.FirstOrDefault(purI => purI.PurchaseId == purchaseId);
                if (purchaImage != null)
                {
                    fileName = purchaImage.Id + fileNameExtension;

                    // Get the object used to communicate with the server.
                    var UriString = uploadUrl + @"/" + fileName;
                    FtpWebRequest request = (FtpWebRequest)WebRequest.Create(UriString);
                    request.Method = WebRequestMethods.Ftp.UploadFile;
                    request.Credentials = new NetworkCredential(ftpUserName, ftpPassword);
                    request.UsePassive = true;
                    request.UseBinary = true;
                    request.KeepAlive = false;
                    request.EnableSsl = false;

                    // Read file contents into a byte array
                    using (MemoryStream ms = new MemoryStream())
                    {
                        await fileToUpload.CopyToAsync(ms);
                        byte[] buffer = ms.ToArray();

                        // Upload the file to FTP
                        request.ContentLength = buffer.Length;
                        using (Stream requestStream = request.GetRequestStream())
                        {
                            await requestStream.WriteAsync(buffer, 0, buffer.Length);
                        }
                    }
                }
                return fileName;

            }
            catch (WebException e)
            {
                // Handle exceptions
                var status = ((FtpWebResponse)e.Response).StatusDescription;
                var requestData = string.Format("fileName: {0},contentLength: {1}", fileName, contentLength);
                _logger.LogError("FtpService.UploadPurchaseFileToFTP", requestData);
                return "";
            }
            catch (Exception ex)
            {
                // Handle exceptions
                var requestData = string.Format("fileName: {0},contentLength: {1}", fileName, contentLength);
                _logger.LogError("FtpService.UploadPurchaseFileToFTP", ex.Message, requestData);
                return "";
            }
        }

        public async Task<bool> DeleteFileFromFTP(string fileName, string folder)
        {
            string ftpUrl = _ftpSettings.UploadUrl + folder; // نفس URL الخاص بالرفع
            string ftpUserName = _ftpSettings.UserName;
            string ftpPassword = _ftpSettings.Password;

            try
            {
                var uriString = $"{ftpUrl}/{fileName}";

                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(uriString);
                request.Method = WebRequestMethods.Ftp.DeleteFile;
                request.Credentials = new NetworkCredential(ftpUserName, ftpPassword);
                request.UsePassive = true;
                request.UseBinary = true;
                request.KeepAlive = false;
                request.EnableSsl = false;

                using (FtpWebResponse response = (FtpWebResponse)await request.GetResponseAsync())
                {
                    _logger.LogInformation($" {fileName} was deleted successfuly: {response.StatusDescription}");
                    return true;
                }
            }
            catch (WebException e)
            {
                var statusDescription = ((FtpWebResponse)e.Response)?.StatusDescription ?? "No Response";
                _logger.LogError($"Error deleting the file: {fileName} from the FTP. status: {statusDescription}");
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Exception  occured while deleting the file: {fileName}  from FTP: {ex.Message}");
                return false;
            }
        }

        public async Task<List<string>> DeleteFilesFromFTP(List<string> fileNames, string folder, int maxRetries = 3)
        {
            var failedFiles = new ConcurrentBag<string>();

            // Run tasks in parallel
            var deleteTasks = fileNames.Select(fileName =>
                Task.Run(async () =>
                {
                    bool deleted = await RetryAsync(() => DeleteFileFromFTP(fileName, folder), maxRetries);

                    if (!deleted)
                    {
                        failedFiles.Add(fileName);
                        _logger.LogWarning($"❌ failed to delete {fileName} after: {maxRetries} tries.");
                    }
                })
            );

            await Task.WhenAll(deleteTasks);

            // Return failed files as a list
            return failedFiles.ToList();
        }
        private async Task<bool> RetryAsync(Func<Task<bool>> action, int maxRetries, int delayMilliseconds = 1000)
        {
            int attempt = 0;

            while (attempt < maxRetries)
            {
                attempt++;

                try
                {
                    bool result = await action();

                    if (result)
                    {
                        return true; // Success
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"❌ attempt {attempt} failed with error: {ex.Message}");
                }

                if (attempt < maxRetries)
                {
                    await Task.Delay(delayMilliseconds);
                }
            }

            return false; // Failed after max retries
        }

        public async Task<List<string>> ListFilesFromFTP(string folder, int productId)
        {
            var matchingFiles = new List<string>();

            string ftpUrl = _ftpSettings.UploadUrl + folder;
            string ftpUserName = _ftpSettings.UserName;
            string ftpPassword = _ftpSettings.Password;

            try
            {
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(ftpUrl);
                request.Method = WebRequestMethods.Ftp.ListDirectory;
                request.Credentials = new NetworkCredential(ftpUserName, ftpPassword);
                request.UsePassive = true;
                request.UseBinary = true;
                request.KeepAlive = false;
                request.EnableSsl = false;

                using (FtpWebResponse response = (FtpWebResponse)await request.GetResponseAsync())
                using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                {
                    while (!reader.EndOfStream)
                    {
                        var fileName = await reader.ReadLineAsync();
                        if (!string.IsNullOrWhiteSpace(fileName) &&
                            fileName.StartsWith($"prod_{productId}_", StringComparison.OrdinalIgnoreCase))
                        {
                            matchingFiles.Add(fileName);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Failed to list FTP files from folder '{folder}': {ex.Message}");
            }

            return matchingFiles;
        }
    }
}

