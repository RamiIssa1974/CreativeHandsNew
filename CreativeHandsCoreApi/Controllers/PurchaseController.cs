using Microsoft.AspNetCore.Mvc;
using MarketCoreGeneral.Requests;
using CreativeHandsCoreApi.Services;
using MarketCoreGeneral.Models.Authintication;
using MarketCoreGeneral.Models.Orders;

namespace CreativeHandsCoreApi.Controllers
{
    [ApiController]
    [Route("api/purchases")]
    public class PurchaseController : ControllerBase
    {
        private readonly IPurchaseRepository _repository;

        public PurchaseController(IPurchaseRepository repo)
        {
            _repository = repo;
        }
        //[Route("Api/Users/GetUserInfo")]
        [HttpPost]
        //[Route("Api/Purchases/GetPurchases")]
        [Route("GetPurchases")]
        public async Task<IActionResult> GetPurchases([FromBody]GetPurchaseRequest request)
        {
            // Validate the request
            if (request == null)
            {
                return BadRequest("Invalid request data."); // Return 400 if the request is null
            }

            try
            {
                // Fetch purchases from the repository
                var purchases = await _repository.GetPurchases(request);

                // Check if purchases are null or empty
                if (purchases == null || !purchases.Any())
                {
                    return NotFound("No purchases found for the given request."); // Return 404 if no purchases found
                }

                // Return OK with the purchases data
                return Ok(purchases);
            }
            catch (Exception ex)
            {
                // Log the exception (optional)
                // _logger.LogError(ex, "An error occurred while fetching purchases");

                // Return 500 Internal Server Error with an error message
                return StatusCode(500, "An error occurred while fetching purchases.");
            }
        }

        [HttpGet]
        //[Route("Api/Purchases/GetPurchasesById")]
        [Route("purchases")]
        public async Task<IActionResult> GetPurchasesById(int purchaseId)
        {
            // Validate the purchaseId
            if (purchaseId <= 0)
            {
                return BadRequest("Invalid purchase ID."); // Return 400 if the purchaseId is invalid
            }

            try
            {
                // Fetch the purchase from the repository
                var purchase = await _repository.GetPurchasesById(purchaseId);

                // Check if the purchase is null
                if (purchase == null)
                {
                    return NotFound($"No purchase found with ID {purchaseId}."); // Return 404 if no purchase found
                }

                // Return OK with the purchase data
                return Ok(purchase);
            }
            catch (Exception ex)
            {
                // Log the exception (optional)
                // _logger.LogError(ex, "An error occurred while fetching the purchase");

                // Return 500 Internal Server Error with an error message
                return StatusCode(500, "An error occurred while fetching the purchase.");
            }
        }

        [HttpPost]
        [Route("purchase")]
        public async Task<IActionResult> SavePurchase([FromBody]PurchaseModel purchase)
        {
            // Validate the input
            if (purchase == null)
            {
                return BadRequest("Invalid purchase data."); // Return 400 if the purchase object is null
            }

            try
            {
                // Save the purchase and get the ID
                var purchaseId = await _repository.SavePurchase(purchase);

                // Check if the ID is valid
                if (purchaseId <= 0)
                {
                    return StatusCode(500, "An error occurred while saving the purchase."); // Return 500 if the ID is not valid
                }

                // Return 201 Created with the purchase ID
                return CreatedAtAction(nameof(GetPurchasesById), new { purchaseId = purchaseId }, purchaseId);
            }
            catch (Exception ex)
            {
                // Log the exception (optional)
                // _logger.LogError(ex, "An error occurred while saving the purchase");

                // Return 500 Internal Server Error with an error message
                return StatusCode(500, "An error occurred while saving the purchase.");
            }
        }


        [HttpGet]
        [Route("GetProviders")]
        public async Task<IActionResult> GetProviders()
        {
            try
            {
                // Retrieve providers from the repository
                var providers = await _repository.GetProviders();

                // Check if providers are null or empty
                if (providers == null || !providers.Any())
                {
                    // Return 404 Not Found if no providers are found
                    return NotFound("No providers found.");
                }

                // Return 200 OK with the list of providers
                return Ok(providers);
            }
            catch (Exception ex)
            {
                // Log the exception (optional)
                // _logger.LogError(ex, "An error occurred while retrieving providers.");

                // Return 500 Internal Server Error with an error message
                return StatusCode(500, "An error occurred while retrieving providers.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProviderModel>> GetProviderById(int id)
        {
            var provider = await _repository.GetProviderById(id);

            if (provider == null)
            {
                return NotFound();
            }

            return Ok(provider);
        }

        [HttpPost]
        [Route("SaveProvider")]
        public async Task<IActionResult> SaveProvider(ProviderModel provider)
        {
            // Check if the provider model is null
            if (provider == null)
            {
                // Return 400 Bad Request if the provider is null
                return BadRequest("Provider cannot be null.");
            }

            try
            {
                // Save the provider and get the provider ID
                var providerId = await _repository.SaveProvider(provider);

                // Check if provider ID is valid (assuming valid IDs are greater than 0)
                if (providerId <= 0)
                {
                    // Return 500 Internal Server Error if provider ID is invalid
                    return StatusCode(500, "An error occurred while saving the provider.");
                }

                // Return 201 Created with the provider ID in the response
                return CreatedAtAction(nameof(GetProviderById), new { id = providerId }, providerId);
            }
            catch (Exception ex)
            {
                // Log the exception (optional)
                // _logger.LogError(ex, "An error occurred while saving the provider.");

                // Return 500 Internal Server Error with an error message
                return StatusCode(500, "An error occurred while saving the provider.");
            }
        }

    }
}
