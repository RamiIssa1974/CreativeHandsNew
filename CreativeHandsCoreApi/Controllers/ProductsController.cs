using Microsoft.AspNetCore.Mvc;
using MarketCoreGeneral.Requests;
using CreativeHandsCoreApi.Services;
using MarketCoreGeneral.Models.Orders;
using MarketCoreGeneral.Models.Products;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;


namespace CreativeHandsCoreApi.Controllers
{
    [ApiController]
    [Route("api/products")]

    public class ProductsController : ControllerBase
    {
        private readonly IMemoryCache _memoryCache;

        private readonly IProductsRepository _productsRepository;

        public ProductsController(IProductsRepository productsRepository, IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;

            _productsRepository = productsRepository;
        }
        [HttpPost]
        //[Route("Api/Products/GetProducts")]
        [Route("GetProducts")]
        public async Task<ActionResult<List<ProductModel>>> GetProducts(GetProductRequest request)
        {
            try
            {             
                //TODO this function returns all the product and dont filter data by request
                var allProducts = await _productsRepository.GetCachedProductsAsync(request);

                if (allProducts == null || !allProducts.Any())
                {
                    return NotFound("No products found.");
                }

                return Ok(allProducts.ToList());
            }
            catch (Exception ex)
            {
                // ניתן להוסיף כאן לוג עבור השגיאה
                return StatusCode(500, "An error occurred while retrieving products.");
            }
        }


        [HttpGet]
        //[Route("Api/Products/GetProductCategories")]
        [Route("ProductCategories")]
        public async Task<ActionResult<List<ProductCategoryModel>>> GetProductCategories()
        {
            try
            {
                // Fetching product categories from the repository
                var prC = await _productsRepository.GetProductCategories();

                // Checking if the result is null or empty
                if (prC == null || !prC.Any())
                {
                    return NotFound("No product categories found."); // Return 404 if no categories are found
                }

                // Returning the list of product categories
                return Ok(prC.ToList());
            }
            catch (Exception ex)
            {
                // Logging the exception (optional)
                // _logger.LogError(ex, "An error occurred while retrieving product categories");

                // Return 500 Internal Server Error with a message
                return StatusCode(500, "An error occurred while retrieving product categories.");
            }
        }


        [HttpPost]
        //[Route("Api/Products/SaveProduct")]
        [Route("Product")]
        public async Task<ActionResult<int>> SaveProduct([FromBody]SaveProductRequest request)
        {
            try
            {
                // Validate the request (example: check if required fields are not null)
                if (request == null)
                {
                    return BadRequest("Invalid product data."); // Return 400 Bad Request if the request is null
                }

                // Save the product and get the product ID
                var productId = await _productsRepository.SaveProduct(request);

                // Check if the product was saved successfully (assuming 0 or -1 indicates failure)
                if (productId <= 0)
                {
                    return StatusCode(500, "An error occurred while saving the product."); // Return 500 Internal Server Error
                }

                // Return the product ID
                return Ok(productId);
            }
            catch (Exception ex)
            {
                // Logging the exception (optional)
                // _logger.LogError(ex, "An error occurred while saving the product");

                // Return 500 Internal Server Error with a message
                return StatusCode(500, "An error occurred while saving the product.");
            }
        }

        [HttpGet]
        //[Route("Api/Products/GetCategories")]
        [Route("Categories")]
        public async Task<ActionResult<CategoryModel>> GetCategories()
        {
            try
            {
                // Fetching categories from the repository
                var categories = await _productsRepository.GetCategories();

                // Checking if the result is null or empty
                if (categories == null || !categories.Any())
                {
                    return NotFound("No categories found."); // Return 404 if no categories are found
                }

                // Returning the list of categories
                return Ok(categories);
            }
            catch (Exception ex)
            {
                // Logging the exception (optional)
                // _logger.LogError(ex, "An error occurred while retrieving categories");

                // Return 500 Internal Server Error with a message
                return StatusCode(500, "An error occurred while retrieving categories.");
            }
        }

        [HttpGet]
        //[Route("Api/Products/GetImages")]
        [Route("Images")]
        public async Task<IActionResult> GetImages()
        {
            try
            {
                // Fetching images from the repository
                var images = await _productsRepository.GetImages();

                // Checking if the result is null or empty
                if (images == null || !images.Any())
                {
                    return NotFound("No images found."); // Return 404 if no images are found
                }

                // Returning the list of images
                return Ok(images);
            }
            catch (Exception ex)
            {
                // Logging the exception (optional)
                // _logger.LogError(ex, "An error occurred while retrieving images");

                // Return 500 Internal Server Error with a message
                return StatusCode(500, "An error occurred while retrieving images.");
            }
        }

        [HttpGet]
        //[Route("Api/Products/GetProductVariations")]
        [Route("ProductVariations")]
        public async Task<IActionResult> GetProductVariations()
        {
            try
            {
                // Fetching product variations from the repository
                var productVariations = await _productsRepository.GetProductVariations();

                // Checking if the result is null or empty
                if (productVariations == null || !productVariations.Any())
                {
                    return NotFound("No product variations found."); // Return 404 if no product variations are found
                }

                // Returning the list of product variations
                return Ok(productVariations);
            }
            catch (Exception ex)
            {
                // Logging the exception (optional)
                // _logger.LogError(ex, "An error occurred while retrieving product variations");

                // Return 500 Internal Server Error with a message
                return StatusCode(500, "An error occurred while retrieving product variations.");
            }
        }

        [HttpGet]
        //[Route("Api/Products/GetAvailableColours")]
        [Route("AvailableColours")]
        public async Task<IActionResult> GetAvailableColours()
        {
            try
            {
                // Fetching available colours from the repository
                var colours = await _productsRepository.GetAvailableColours();

                // Checking if the result is null or empty
                if (colours == null || !colours.Any())
                {
                    return NotFound("No colours available."); // Return 404 if no colours are found
                }

                // Returning the list of available colours
                return Ok(colours);
            }
            catch (Exception ex)
            {
                // Logging the exception (optional)
                // _logger.LogError(ex, "An error occurred while retrieving available colours");

                // Return 500 Internal Server Error with a message
                return StatusCode(500, "An error occurred while retrieving available colours.");
            }
        }
    }
}