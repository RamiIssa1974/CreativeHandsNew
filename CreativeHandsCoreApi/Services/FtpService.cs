using AutoMapper;
using CreativeHandsCoreApi.DbContexts;
using CreativeHandsCoreApi.Entities.Sql;
using MarketCoreGeneral.Models.Authintication;
using MarketCoreGeneral.Requests;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System.Net;

namespace CreativeHandsCoreApi.Services
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
        
    }
}

