using AutoMapper;
using CreativeHandsCoreApi.DbContexts;
using CreativeHandsCoreApi.Entities.Sql.Products;
using CreativeHandsCoreApi.Entities.Sql.Video;
using MarketCoreGeneral.Models.Video;
using MarketCoreGeneral.Responses;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace CreativeHandsCoreApi.Services
{
    public class VideoRepository : IVideoRepository
    {
        private ILogger<VideoRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly MarketContext _context;
        private readonly HttpContent? httpContent;
        private readonly HttpClient httpClient;
        private readonly IFtpService _ftpService;
        public VideoRepository(MarketContext context,
            ILogger<VideoRepository> logger,
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
        public async Task<IEnumerable<VideoModel>> GetVideos(VideoModel request)
        {
            try
            {
                var _videos = _context.Video.Where(rq => (request.Id == -1 || rq.Id == request.Id)
                                                            && (string.IsNullOrEmpty(request.Name) || rq.Name.Contains(request.Name))
                                                            && (string.IsNullOrEmpty(request.Title) || rq.Title.Contains(request.Title))
                                                            && (string.IsNullOrEmpty(request.Description) || rq.Description.Contains(request.Description))).ToList();
                if (_videos != null && _videos.Any())
                {
                    var videosModel = _mapper.Map<IEnumerable<VideoModel>>(_videos);
                    return videosModel;
                }
                return null;
            }
            catch (Exception ex)
            {
                var requestData = JsonConvert.SerializeObject(request);
                _logger.LogError("VideoRepository.GetVideos", null, -1, "", ex.Message, requestData);
                throw;
            }
        }
        public async Task<UploadFilesResponse> SaveVideo(IFormFile file, VideoModel request)
        {
            try
            {
                var videoId = 0;
                if (file == null || file.Length == 0)
                {
                    return new UploadFilesResponse() { ProductId = -1, PurchaseId = -1, UploadedImages = null, VideoId = -1 };
                }
                var response = new UploadFilesResponse();
                response.UploadedImages = new List<string>();

                if (request.Id <= 0)
                {
                    var sqlVideo = new SqlVideo() { Name = request.Name, Title = request.Title, Description = request.Description };
                    _context.Video.Add(sqlVideo);
                    _context.SaveChanges();
                    videoId = sqlVideo.Id;

                }
                response.VideoId = videoId;

                string fileNameExtension = Path.GetExtension(file.FileName);                
                var fileName = videoId + fileNameExtension;

                var uploadedFileName = await _ftpService.UploadToFTP(file, fileName, "videos");

                if (uploadedFileName != null)
                {
                    response.UploadedImages.Add(uploadedFileName);
                }

                //Crop(Width: 140, Height: 100, streamImg: postedFile.InputStream, "thumb." + uploadedFileName);
                return response;
            }
            catch (Exception ex)
            {
                var requestData = JsonConvert.SerializeObject(request);
                _logger.LogError("VideoRepository.SaveVideo", null, -1, "", ex.Message, requestData);
                throw;
            }
        }
    }
}