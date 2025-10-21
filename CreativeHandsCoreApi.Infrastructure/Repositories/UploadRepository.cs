using AutoMapper;
using CreativeHandsCoreApi.Domain.Repositories;
using CreativeHandsCoreApi.Infrastructure.Entities;
using CreativeHandsCoreApi.Infrastructure.Entities.Products;
using CreativeHandsCoreApi.Infrastructure.Persistence;
using CreativeHandsCoreApi.Infrastructure.Services.Ftp;
using MarketCoreGeneral.Responses;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net;

namespace CreativeHandsCoreApi.Infrastructure.Repositories
{
    public class UploadRepository : IUploadRepository
    {
        private ILogger<UploadRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly MarketContext _context;
        private readonly IFtpService _ftpService;
        private readonly HttpContent? httpContent;
        private readonly HttpClient httpClient;
        public UploadRepository(MarketContext context,
                                ILogger<UploadRepository> logger,
                                IConfiguration configuration,
                                IMapper mapper,
                                IFtpService ftpService)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper;
            _configuration = configuration;
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _ftpService = ftpService;
        }
        public async Task<UploadFilesResponse> UploadFile(IFormFile file, int productId)
        {
            if (file == null || file.Length == 0)
            {
                return new UploadFilesResponse(){ ProductId = -1, PurchaseId = -1, UploadedImages = null, VideoId = -1 };
            }
            var response = new UploadFilesResponse();
            response.UploadedImages = new List<string>();
             
            if (productId <= 0)
            {
                var product = new SqlProduct() { Name = "", Price = 0 };
                _context.Product.Add(product);
                _context.SaveChanges();
                productId = product.Id;

            }
            response.ProductId = productId;

            string fileNameExtension = Path.GetExtension(file.FileName);
            var newImage = new SqlImage
            {
                ProductId = productId,
                Extension = fileNameExtension.Substring(1)
            };

            _context.Image.Add(newImage);
            await _context.SaveChangesAsync(); // Use async version of SaveChanges

            var fileName = newImage.Id + fileNameExtension;

            var uploadedFileName = await _ftpService.UploadToFTP(file, fileName, "Images");

            if (uploadedFileName != null)
            {
                response.UploadedImages.Add(uploadedFileName);
            }

            //Crop(Width: 140, Height: 100, streamImg: postedFile.InputStream, "thumb." + uploadedFileName);
            return response;
        }
        public async  Task<UploadFilesResponse> UploadPurchaseFile(IFormFile file,int purchaseId)
        {
            var response = new UploadFilesResponse();
            response.UploadedImages = new List<string>();


            if (file == null || file.Length == 0)
            {
                return new UploadFilesResponse() { ProductId = -1, PurchaseId = -1, UploadedImages = null, VideoId = -1 };
            }

            
            string fileNameExtension = Path.GetExtension(file.FileName);
            var purchaImage = _context.PurchaseImage.FirstOrDefault(purI => purI.PurchaseId == purchaseId);
            var fileName = purchaImage.Id + fileNameExtension;

            var uploadedFileName = await _ftpService.UploadToFTP(file, fileName, "Images/Purchases");

            response.PurchaseId = purchaseId;
            response.UploadedImages.Add(uploadedFileName);

            return response;
        }

        public async Task<UploadFilesResponse> UploadUmbracoFiles(List<IFormFile> files, int productId)
        {
            var response = new UploadFilesResponse
            {
                ProductId = productId,
                UploadedImages = new List<string>()
            };

            if (files == null || files.Count == 0)
            {
                return response;
            }

            var productPrefix = $"prod_{productId}_";
            var existingFiles = await _ftpService.ListFilesFromFTP("Images/Umbraco", productId);

            var productFiles = existingFiles
                .Where(f => f.StartsWith(productPrefix, StringComparison.OrdinalIgnoreCase))
                .ToList();

            if (productFiles.Any())
            {
                var failedDeletes = await _ftpService.DeleteFilesFromFTP(productFiles, "Images/Umbraco");
                // Optionally log
            }

            int i = 1;
            var lockObj = new object();

            // Parallel file upload
            await Parallel.ForEachAsync(files, async (file, ct) =>
            {
                var ext = Path.GetExtension(file.FileName);
                var index = Interlocked.Increment(ref i);
                var newFileName = $"prod_{productId}_{index}{ext}";

                var uploadedFileName = await _ftpService.UploadToFTP(file, newFileName, "Images/Umbraco");

                if (uploadedFileName != null)
                {
                    lock (lockObj)
                    {
                        response.UploadedImages.Add(uploadedFileName);
                    }
                }
            });

            return response;
        }

        public async Task<UploadFilesResponse> UploadUmbracoFilesOld(List<IFormFile> files, int productId)
        {
            var response = new UploadFilesResponse
            {
                ProductId = productId,
                UploadedImages = new List<string>()
            };

            if (files == null || files.Count == 0)
            {
                return response;
            }

            // Step 1: Delete existing images for this product from FTP
            // We'll assume naming format is: prod_{productId}_*.ext
            var productPrefix = $"prod_{productId}_";
            var existingFiles = await _ftpService.ListFilesFromFTP("Images/Umbraco", productId);

            var productFiles = existingFiles
                .Where(f => f.StartsWith(productPrefix, StringComparison.OrdinalIgnoreCase))
                .ToList();

            if (productFiles.Any())
            {
                var failedDeletes = await _ftpService.DeleteFilesFromFTP(productFiles, "Images/Umbraco");
                // Optional: Log any failed deletions
            }

            // Step 2: Upload new files with formatted names
            int i = 1;
            foreach (var file in files)
            {
                var ext = Path.GetExtension(file.FileName);
                var newFileName = $"prod_{productId}_{i++}{ext}";

                var uploadedFileName = await _ftpService.UploadToFTP(file, newFileName, "Images/Umbraco");

                if (uploadedFileName != null)
                {
                    response.UploadedImages.Add(uploadedFileName);
                }
            }

            return response;
        }

        
    }
}
