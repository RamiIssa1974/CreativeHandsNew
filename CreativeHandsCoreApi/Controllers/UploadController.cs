using Microsoft.AspNetCore.Mvc;
using MarketCoreGeneral.Requests;
using CreativeHandsCoreApi.Services;
using MarketCoreGeneral.Models.Authintication;
using MarketCoreGeneral.Models.Orders;
using Microsoft.AspNetCore.Http;
using MarketCoreGeneral.Responses;

namespace CreativeHandsCoreApi.Controllers
{
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IUploadRepository _repository;
        private readonly IProductsRepository _productsRepository;

        public UploadController(IUploadRepository repo, IProductsRepository productsRepository)
        {
            _repository = repo;
            _productsRepository = productsRepository;
        }

        [HttpPost]
        //[Route("Api/UploadFiles")]
        [Route("Api/UploadFiles")]
        //public async Task<ActionResult<UploadFilesResponse>> UploadFile([FromForm] IFormFile file, [FromForm] int productId)
        public async Task<ActionResult<UploadFilesResponse>> UploadFiles([FromForm] List<IFormFile> files, [FromForm] int productId)
        {
            var response = new UploadFilesResponse();
            if (files == null || files.Count == 0 || files[0].Length == 0)
            {
                return BadRequest("No files were uploaded.");
            }

            if (productId <= 0)
            {
                productId = await _productsRepository.SaveProduct(new SaveProductRequest()
                {
                    Name = "",
                    Price = 0,
                });

            }
            response.ProductId = productId;

            try
            {
                //TO DO make it files and not only the first file
                response = await _repository.UploadFile(files[0], productId);

                if (response == null)
                {
                    return NotFound("Problem occured while Uploading the file.");
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                // Log the exception
                // _logger.LogError(ex, "An error occurred while uploading the file.");

                return StatusCode(500, "An error occurred while uploading the file.");
            }
        }

        [HttpPost]
        //[Route("Api/UploadFiles")]
        [Route("Api/UploadPurchaseFile")]
        public async Task<ActionResult<IEnumerable<PurchaseModel>>> UploadPurchaseFile([FromForm] IFormFile file, [FromForm] int purchaseId)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Invalid file.");
            }

            if (purchaseId <= 0)
            {
                return BadRequest("Invalid purchase ID.");
            }

            try
            {
                var response = await _repository.UploadPurchaseFile(file, purchaseId);

                if (response == null)
                {
                    return NotFound("No purchases found for the given purchase ID.");
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                // Log the exception
                // _logger.LogError(ex, "An error occurred while uploading the purchase file.");

                return StatusCode(500, "An error occurred while uploading the purchase file.");
            }
        }


    }
}
