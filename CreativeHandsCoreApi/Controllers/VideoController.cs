using Microsoft.AspNetCore.Mvc;
using MarketCoreGeneral.Models.Video;
using MarketCoreGeneral.Responses;
using CreativeHandsCoreApi.Domain.Repositories;
using CreativeHandsCoreApi.Authorization;

namespace CreativeHandsCoreApi.Controllers
{
    [ApiController]
    [ConditionalAuthorize]
    public class VideoController : ControllerBase
    {
        private readonly IVideoRepository _repository;

        public VideoController(IVideoRepository repo)
        {
            _repository = repo;
        }
         
        [HttpPost]
        //[Route("Api/UploadFiles")]
        [Route("api/video/Videos")]
        public async Task<ActionResult<IEnumerable<VideoModel>>> GetVideos(VideoModel request)
        { 
            if (request == null)
            {
                return BadRequest("Invalid request.");
            }

            try
            {
                var response = await _repository.GetVideos(request);

                if (response == null || !response.Any())
                {
                    return NotFound("No videos found matching the given criteria.");
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                // Log the exception
                // _logger.LogError(ex, "An error occurred while retrieving videos.");

                return StatusCode(500, "An error occurred while retrieving videos.");
            }
        }

        [HttpPost]        
        [Route("Api/video/SaveVideo")]
        public async Task<ActionResult<UploadFilesResponse>> SaveVideo(IFormFile file, VideoModel request)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Invalid file.");
            }

            if (request == null)
            {
                return BadRequest("Invalid request.");
            }

            try
            {
                var response = await _repository.SaveVideo(file, request);

                if (response == null)
                {
                    return StatusCode(500, "An error occurred while saving the video.");
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                // Log the exception
                // _logger.LogError(ex, "An error occurred while saving the video.");

                return StatusCode(500, "An error occurred while saving the video.");
            }
        }

        [HttpPost]
        [Route("Api/video/SaveVideoNew")]
        public async Task<ActionResult<UploadFilesResponse>> SaveVideoNew(
            [FromForm] IFormFile file,
            [FromForm] VideoModel request)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Invalid file.");
            }

            if (request == null)
            {
                return BadRequest("Invalid request.");
            }

            try
            {
                var response = await _repository.SaveVideo(file, request);

                if (response == null)
                {
                    return StatusCode(500, "An error occurred while saving the video.");
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                // Log the exception
                // _logger.LogError(ex, "An error occurred while saving the video.");

                return StatusCode(500, "An error occurred while saving the video.");
            }
        }
        [HttpDelete]
        [Route("api/video/DeleteVideo/{videoId}")]
        public async Task<IActionResult> DeleteVideo(int videoId)
        {
            try
            {
                Console.WriteLine($"Deleting Video ID: {videoId}");

                var res = await _repository.DeleteVideo(videoId);

                if (res)
                {
                    return Ok($"Video with ID {videoId} deleted.");
                }
                else
                {
                    return BadRequest($"Video with ID {videoId} not found.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting Video: {ex.Message}");
                return StatusCode(500, "Internal server error, Deleting Video: " + videoId);
            }
        }
    }
}
