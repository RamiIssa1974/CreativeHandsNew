using Microsoft.AspNetCore.Mvc;
using MarketCoreGeneral.Requests;
using CreativeHandsCoreApi.Services;
using MarketCoreGeneral.Models.Authintication;

namespace CreativeHandsCoreApi.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class GeneralController : ControllerBase
    {
        private readonly IMarketRepository _marketRepository;

        public GeneralController(IMarketRepository marketRepository)
        {
            _marketRepository = marketRepository;
        }
        //[Route("Api/Users/GetUserInfo")]
        [HttpPost]
        [Route("user-info")]
        public async Task<IActionResult> GetUser([FromBody] GetUserRequest request)
        {
            try
            {                 
                // קבלת רשימת משתמשים מהמאגר
                var users = await _marketRepository.GetUsersAsynch(request);

                // מציאת המשתמש הראשון מתוך הרשימה
                var user = users.FirstOrDefault();

                // בדיקה אם המשתמש לא נמצא
                if (user == null)
                {
                    return NotFound("User not found."); // מחזיר תשובת 404 אם המשתמש לא נמצא
                }

                // החזרת המשתמש בתשובת Ok
                return Ok(user);
            }
            catch (Exception ex)
            {
                // Logging the exception (optional)
                // _logger.LogError(ex, "An error occurred while retrieving the user");

                // Return 500 Internal Server Error with a message
                return StatusCode(500, "An error occurred while retrieving the user.");
            }
        }
    }
}
