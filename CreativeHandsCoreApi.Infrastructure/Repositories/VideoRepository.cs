using AutoMapper;
using CreativeHandsCoreApi.Domain.Repositories;
using CreativeHandsCoreApi.Infrastructure.Entities.Video;
using CreativeHandsCoreApi.Infrastructure.Persistence;
using CreativeHandsCoreApi.Infrastructure.Services.Ftp;
using MarketCoreGeneral.Models.Video;
using MarketCoreGeneral.Responses;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;


namespace CreativeHandsCoreApi.Infrastructure.Repositories
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
                                                            && (string.IsNullOrEmpty(request.VideoName) || rq.Name.Contains(request.VideoName))
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

                var trimedFileName = Helpers.ToValidCamelCaseFileName(request.VideoName);

                string fileNameExtension = Path.GetExtension(file.FileName);
                var fileName = trimedFileName + fileNameExtension;


                if (request.Id <= 0)
                {
                    var sqlVideo = new SqlVideo() { 
                        Name = trimedFileName, 
                        Extension = fileNameExtension.TrimStart('.'),
                        Title = request.Title, 
                        Description = request.Description };
                    _context.Video.Add(sqlVideo);
                    _context.SaveChanges();
                    videoId = sqlVideo.Id;

                }
                else
                {
                    var existingVideo = _context.Video.FirstOrDefault(v => v.Id == request.Id);
                    if (existingVideo!= null)
                    {
                        existingVideo.Name = request.VideoName;
                        existingVideo.Title = request.Title;
                        existingVideo.Description = request.Description;
                        existingVideo.Extension = request.Extension;
                        _context.SaveChanges();
                        videoId = existingVideo.Id;
                    }                    
                }
                response.VideoId = videoId;

                
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
         
        public async Task<bool> DeleteVideo(int videoId)
        {
            try
            {
                var video = await _context.Video
                    .FirstOrDefaultAsync(p => p.Id == videoId);

                if (video == null)
                {
                    return false;
                }
                var filename = video.Name + "."+ video.Extension;
                _context.Video.Remove(video);
                await _context.SaveChangesAsync();
                if (filename != null)
                {
                    var failedFiles = await _ftpService.DeleteFilesFromFTP([filename], "Videos");

                    if (failedFiles.Any())
                    {
                        _logger.LogWarning($"some images failed to delete from FTP: {string.Join(", ", failedFiles)}");
                    }

                }
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("VideoRepository.DeleteVideo", null, -1, "", ex.Message, $", videoId: {videoId}");
                return false;
            }
        }

    }
}