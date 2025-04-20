using Microsoft.AspNetCore.Mvc;
using MarketCoreGeneral.Requests;
using MarketCoreGeneral.Models.Orders;
using Microsoft.EntityFrameworkCore;
using CreativeHandsCoreApi.Domain.Repositories;
using CreativeHandsCoreApi.Authorization;

namespace CreativeHandsCoreApi.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrdersRepository _ordersRepository;

        public OrdersController(IOrdersRepository ordersRepository)
        {
            _ordersRepository = ordersRepository;
        }
        //[Route("Api/Orders/GetCart")]
        [HttpGet]
        [Route("cart")]
        public async Task<IActionResult> GetCart(string userId)
        {
            try
            {
                // קבלת הסל מהמאגר עבור מזהה המשתמש
                var cart = await _ordersRepository.GetCart(userId);

                // בדיקה אם הסל הוא null
                if (cart == null)
                {
                    cart = await _ordersRepository.GetEmptyCart(userId);
                    //return NotFound("Cart not found for the given user."); // מחזיר תשובת 404 אם הסל לא נמצא
                }

                // החזרת הסל בתשובת Ok
                return Ok(cart);
            }
            catch (Exception ex)
            {
                // Logging the exception (optional)
                // _logger.LogError(ex, "An error occurred while retrieving the cart");

                // Return 500 Internal Server Error with a message
                return StatusCode(500, "An error occurred while retrieving the cart.");
            }
        }

        //[Route("Api/Orders/GetOrder")]
        [HttpPost]
        [Route("Order")]
        public async Task<IActionResult> GetOrder([FromBody] GetOrderRequest request)
        {
            if (request == null || request.OrderId <= 0)
            {
                return BadRequest("Invalid request."); // מחזיר תשובת 400 אם הבקשה לא תקינה
            }

            try
            {
                // קבלת ההזמנה מהמאגר עבור מזהה ההזמנה
                var order = await _ordersRepository.GetOrderById(request.OrderId);

                // בדיקה אם ההזמנה היא null
                if (order == null)
                {
                    return NotFound("Order not found."); // מחזיר תשובת 404 אם ההזמנה לא נמצאה
                }
                // החזרת ההזמנה בתשובת Ok
                return Ok(order);
            }
            catch (Exception ex)
            {
                // Logging the exception (optional)
                // _logger.LogError(ex, "An error occurred while retrieving the order");

                // Return 500 Internal Server Error with a message
                return StatusCode(500, "An error occurred while retrieving the order.");
            }
        }


        [HttpPost]
        [Route("Orders")]
        [ConditionalAuthorize]
        public async Task<IActionResult> GetOrders([FromBody] GetOrderRequest request)
        {
            // בדיקת תקינות הבקשה
            if (request == null)
            {
                return BadRequest("Invalid request."); // מחזיר תשובת 400 אם הבקשה לא תקינה
            }

            try
            {
                // קבלת ההזמנות מהמאגר
                var orders = await _ordersRepository.GetOrders(request);

                // בדיקה אם ההזמנות הן ריקות
                if (orders == null || !orders.Any())
                {
                    return Ok(new List<OrderModel>()); // מחזיר תשובת 404 אם אין הזמנות
                }

                // החזרת ההזמנות בתשובת Ok
                return Ok(orders);
            }
            catch (Exception ex)
            {
                // רישום החריגה (אופציונלי)
                // _logger.LogError(ex, "An error occurred while retrieving the orders");

                // החזרת תשובת 500 Internal Server Error עם הודעה
                return StatusCode(500, "An error occurred while retrieving the orders.");
            }
        }
        //[Route("Api/Orders/AddToCart")]
        [HttpPost]
        [Route("add-to-cart")]
        [ConditionalAuthorize]
        public async Task<ActionResult<int>> AddToCart([FromBody] AddToCartRequest request)
        {
            var orderItemId = await _ordersRepository.AddToCart(request);
            return Ok(orderItemId);
        }
        [HttpPost]
        //[Route("Api/Orders/SaveOrder")]
        [Route("SaveOrder")]
        [ConditionalAuthorize]
        public async Task<IActionResult> SaveOrder([FromBody] OrderModel order)
        {
            // בדיקת תקינות הבקשה
            if (order == null || order.OrderItems == null || !order.OrderItems.Any())
            {
                return BadRequest("Invalid order data."); // מחזיר תשובת 400 אם הבקשה לא תקינה
            }
            try
            {
                // שמירה של ההזמנה מהמאגר
                var orderId = await _ordersRepository.SaveOrder(order);

                // בדיקת תקינות מזהה ההזמנה שהוחזר
                if (orderId <= 0)
                {
                    return StatusCode(500, "Failed to save the order."); // מחזיר תשובת 500 אם לא הצליח לשמור את ההזמנה
                }

                // החזרת מזהה ההזמנה בתשובת Ok
                return Ok(orderId);
            }
            catch (Exception ex)
            {
                // רישום החריגה (אופציונלי)
                // _logger.LogError(ex, "An error occurred while saving the order");

                // החזרת תשובת 500 Internal Server Error עם הודעה
                return StatusCode(500, "An error occurred while saving the order.");
            }
        }
        [HttpPost]
        //[Route("Api/Orders/SaveOrderItem")]
        [Route("SaveOrderItem")]
        public async Task<IActionResult> SaveOrderItem([FromBody] SaveOrderItemRequest orderItem)
        {
            // בדיקת תקינות הבקשה
            if (orderItem == null  )
            {
                return BadRequest("Invalid order item data."); // מחזיר תשובת 400 אם הבקשה לא תקינה
            }
            try
            {                 
                var orderItemId = await _ordersRepository.SaveOrderItem(orderItem);

                // בדיקת תקינות מזהה ההזמנה שהוחזר
                if (orderItemId <= 0)
                {
                    return StatusCode(500, "Failed to save the order item."); 
                }

                // החזרת מזהה ההזמנה בתשובת Ok
                return Ok(orderItemId);
            }
            catch (Exception ex)
            {
                // רישום החריגה (אופציונלי)
                // _logger.LogError(ex, "An error occurred while saving the order");

                // החזרת תשובת 500 Internal Server Error עם הודעה
                return StatusCode(500, "An error occurred while saving the order.");
            }
        }

        [HttpPost]
        //[Route("Api/Orders/ChangeOrderStatus")]
        [Route("ChangeOrderStatus")]
        [ConditionalAuthorize]
        public async Task<IActionResult> ChangeOrderStatus([FromBody] OrderModel order)
        {
            // בדיקת תקינות הבקשה
            if (order == null || order.Id <= 0)
            {
                return BadRequest("Invalid order data."); // מחזיר תשובת 400 אם הבקשה לא תקינה
            }

            try
            {
                // שינוי הסטטוס של ההזמנה מהמאגר
                var orderId = await _ordersRepository.ChangeOrderStatus(order);

                // בדיקת תקינות מזהה ההזמנה שהוחזר
                if (orderId <= 0)
                {
                    return StatusCode(500, "Failed to change the order status."); // מחזיר תשובת 500 אם לא הצליח לשנות את הסטטוס
                }

                // החזרת מזהה ההזמנה בתשובת Ok
                return Ok(orderId);
            }
            catch (Exception ex)
            {
                // רישום החריגה (אופציונלי)
                // _logger.LogError(ex, "An error occurred while changing the order status");

                // החזרת תשובת 500 Internal Server Error עם הודעה
                return StatusCode(500, "An error occurred while changing the order status.");
            }
        }

        [HttpPost]
        [Route("ChangeOrderStatusByChangeOrderStatusRequest")]
        [ConditionalAuthorize]
        public async Task<IActionResult> ChangeOrderStatusByChangeOrderStatusRequest([FromBody] ChangeOrderStatusRequest request)
        {
            if (request == null || request.Id <= 0)
            {
                return BadRequest("Invalid data");
            }

            var order = await _ordersRepository.GetOrderById(request.Id);

            if (order == null)
            {
                return NotFound("Order not found");
            }

            order.StatusId = request.StatusId;

            var updatedOrderId = await _ordersRepository.ChangeOrderStatus(order);

            return Ok(updatedOrderId);
        }

        [HttpPost]
        //[Route("Api/Orders/SendOrder")]
        [Route("SendOrder")]
        public async Task<IActionResult> SendOrder(SendOrderRequest request)
        {
            // Validate the request
            if (request == null)
            {
                return BadRequest("Invalid request data."); // Return 400 if the request is invalid
            }

            try
            {
                // Send the order using the repository method
                bool result = await _ordersRepository.SendOrder(request);

                // Check the result of the operation
                if (!result)
                {
                    return StatusCode(500, "Failed to send the order."); // Return 500 if the operation failed
                }

                // Return OK with the result
                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log the exception (optional)
                // _logger.LogError(ex, "An error occurred while sending the order");

                // Return 500 Internal Server Error with an error message
                return StatusCode(500, "An error occurred while sending the order.");
            }
        }

        [HttpPost]
        //[Route("Api/Orders/migrate-cart")]
        [Route("migrate-cart")]        
        public async Task<IActionResult> MigrateAnonymousCartToUser([FromBody] MigrateAnonymousCartToUserRequest request)
        {
            // בדיקת תקינות הבקשה
            if (request == null || string.IsNullOrEmpty(request.CartToken) || string.IsNullOrEmpty(request.UserId))
            {
                return BadRequest("Invalid order data."); // מחזיר תשובת 400 אם הבקשה לא תקינה
            }
            try
            {
                // שמירה של ההזמנה מהמאגר
                var orderId = await _ordersRepository.MigrateAnonymousCartToUser(request);

                // בדיקת תקינות מזהה ההזמנה שהוחזר
                if (orderId <= 0)
                {
                    return NotFound("No cart found to migrate"); // מחזיר תשובת 500 אם לא הצליח לשמור את ההזמנה
                }

                // החזרת מזהה ההזמנה בתשובת Ok
                return Ok(orderId);
            }
            catch (Exception ex)
            {
                // רישום החריגה (אופציונלי)
                // _logger.LogError(ex, "An error occurred while saving the order");

                // החזרת תשובת 500 Internal Server Error עם הודעה
                return StatusCode(500, "An error occurred while saving the order.");
            }
        }

        [HttpDelete]
        [Route("DeleteOrderItem/{id}")]
        [ConditionalAuthorize]
        public async Task<IActionResult> DeleteOrderItem(int id)
        {
            try
            {
                Console.WriteLine($"Deleting OrderItem ID: {id}");

                var orderItemId = await _ordersRepository.DeleteOrderItem(id);

                // Delete logic here (EF Core example)                

                return Ok($"OrderItem with ID {id} deleted.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting OrderItem: {ex.Message}");
                return StatusCode(500, "Internal server error, Deleting Order Item: " + id);
            }
        }
    }
}
