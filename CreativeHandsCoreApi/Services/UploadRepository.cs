using AutoMapper;
using CreativeHandsCoreApi.DbContexts;
using CreativeHandsCoreApi.Entities.Sql;
using CreativeHandsCoreApi.Entities.Sql.Products;
using MarketCoreGeneral.Responses;
using System.Net;

namespace CreativeHandsCoreApi.Services
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
        //install this package if you wanna use this function: System.Drawing.Common
        //public void Crop(int Width, int Height, Stream streamImg, string saveFilePath)
        //{
        //    Bitmap sourceImage = new Bitmap(streamImg);
        //    using (Bitmap objBitmap = new Bitmap(Width, Height))
        //    {
        //        objBitmap.SetResolution(sourceImage.HorizontalResolution, sourceImage.VerticalResolution);
        //        using (Graphics objGraphics = Graphics.FromImage(objBitmap))
        //        {
        //            // Set the graphic format for better result cropping   
        //            objGraphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;

        //            objGraphics.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
        //            objGraphics.DrawImage(sourceImage, 0, 0, Width, Height);

        //            // Save the file path, note we use png format to support png file  
        //            //var uploadedFileName = GeneralFunctions.UploadToFTP(objBitmap, 10000);
        //            objBitmap.Save(saveFilePath);
        //        }
        //    }
        //}
    }
}
