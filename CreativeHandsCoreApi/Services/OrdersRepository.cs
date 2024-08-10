using AutoMapper;
using CreativeHandsCoreApi.DbContexts;
using CreativeHandsCoreApi.Entities.Sql.Customers;
using CreativeHandsCoreApi.Entities.Sql.Orders;
using CreativeHandsCoreApi.Services.Mail;
using MarketCoreGeneral.Models.Orders;
using MarketCoreGeneral.Requests;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace CreativeHandsCoreApi.Services
{
    public class OrdersRepository : IOrdersRepository
    {
        private ILogger<OrdersRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly MarketContext _context;
        private readonly IMailService _mailer;
        private readonly HttpContent? httpContent;
        private readonly HttpClient httpClient;
        public OrdersRepository(MarketContext context,
            ILogger<OrdersRepository> logger,
            IConfiguration configuration,
            IMapper mapper,
            IMailService mailer)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper;
            _configuration = configuration;
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _mailer = mailer;
        }

        public async Task<OrderModel> GetOrderById(int orderId)
        {
            var sqlOrder = await _context.Order.FirstOrDefaultAsync(ord => ord.Id == orderId);
            var order = _mapper.Map<OrderModel>(sqlOrder);
            return order;
        }

        public async Task<OrderModel> GetCart(string userId)
        {
            try
            {
                var sqlOrder = _context.Order.FirstOrDefault(ord => ord.UserId == userId && ord.StatusId == (int)MarketCoreGeneral.Enums.OrderStatusId.Cart);
                if (sqlOrder != null)
                {
                    var order = _mapper.Map<OrderModel>(sqlOrder);
                    return order;
                }
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError("OrderServices.GetCart", null, -1, "", ex.Message, "userId: " + userId.ToString());
                throw;
            }
        }

        public async Task<int> ChangeOrderStatus(OrderModel order)
        {
            try
            {
                var sqlOrder = _context.Order.FirstOrDefault(ord => ord.Id == order.Id);
                if (sqlOrder != null)
                {

                    sqlOrder.StatusId = order.StatusId;
                }
                _context.SaveChanges();
                return sqlOrder.Id;
            }
            catch (Exception ex)
            {
                var requestData = JsonConvert.SerializeObject(order);
                _logger.LogError("OrderServices.ChangeOrderStatus", null, -1, "", ex.Message, requestData);
                return -1;
            }
        }


        public async Task<int> AddToCart(AddToCartRequest request)
        {
            int orderItemId = -1;
            try
            {
                if (request != null)
                {

                    var sqlOrder = _context.Order.FirstOrDefault(ord => ord.UserId == request.UserId && ord.StatusId == (int)MarketCoreGeneral.Enums.OrderStatusId.Cart);
                    var cart = _context.Order.FirstOrDefault(o => o.StatusId == (int)MarketCoreGeneral.Enums.OrderStatusId.Cart
                    && (string.IsNullOrEmpty(request.UserId) || (o.UserId == request.UserId)));

                    if (cart != null)
                    {
                        var existProduct = _context.OrderItem.FirstOrDefault(oi =>
                            oi.OrderId == cart.Id &&
                            oi.ProductId == request.ProductId);
                        if (existProduct != null)
                        {
                            if (request.ProductVariationId == null)
                            {
                                existProduct.Quantity += request.Quantity;
                            }
                            else
                            {
                                var existProductVariation = _context.OrderItem.FirstOrDefault(oi =>
                                    oi.OrderId == cart.Id &&
                                    oi.ProductVariationId == request.ProductVariationId);
                                if (existProductVariation != null)
                                {
                                    existProductVariation.Quantity += request.Quantity;
                                }
                                else
                                {
                                    request.OrderId = cart.Id;
                                    var dbOrderItem = new SqlOrderItem
                                    {
                                        Quantity = request.Quantity,
                                        UnitPrice = (decimal)(request.ProductUnitPrice > 0 ? request.ProductUnitPrice :
                                                             (request.ProductSalePrice != null && request.ProductSalePrice != 0
                                                             && request.ProductSalePrice < request.ProductPrice ?
                                                             request.ProductSalePrice :
                                                             request.ProductPrice)),
                                        OrderId = cart.Id,
                                        ProductId = request.ProductId,
                                        ProductVariationId = request.ProductVariationId
                                    };
                                    _context.OrderItem.Add(dbOrderItem);
                                }
                            }

                            _context.SaveChanges();

                            orderItemId = existProduct.Id;
                            UpdateOrderItemColours(orderItemId, request.OrderItemColours);
                        }
                        else
                        {
                            request.OrderId = cart.Id;
                            var dbOrderItem = new SqlOrderItem
                            {
                                Quantity = request.Quantity,
                                UnitPrice = (decimal)(request.ProductUnitPrice > 0 ? request.ProductUnitPrice :
                                                             (request.ProductSalePrice != null && request.ProductSalePrice != 0 && request.ProductSalePrice < request.ProductSalePrice ? request.ProductSalePrice :
                                                                                                    request.ProductPrice)),
                                OrderId = cart.Id,
                                ProductId = request.ProductId,
                                ProductVariationId = request.ProductVariationId,
                            };
                            _context.OrderItem.Add(dbOrderItem);
                            _context.SaveChanges();

                            orderItemId = dbOrderItem.Id;
                            UpdateOrderItemColours(orderItemId, request.OrderItemColours);
                        }
                    }
                    else
                    {
                        var globalCustomerId = 1;

                        var newCart = new SqlOrder()
                        {
                            UserId = request.UserId,
                            StatusId = (int)MarketCoreGeneral.Enums.OrderStatusId.Cart,
                            CustomerId = globalCustomerId,
                            Discount = 0,
                            CreateDate = DateTime.Now
                        };
                        _context.Order.Add(newCart);
                        _context.SaveChanges();

                        var dbOrderItem = new SqlOrderItem
                        {
                            Quantity = request.Quantity,
                            UnitPrice = (decimal)(request.ProductUnitPrice > 0 ? request.ProductUnitPrice :
                                                             (request.ProductSalePrice != null && request.ProductSalePrice != 0 && request.ProductSalePrice < request.ProductPrice ? request.ProductSalePrice :
                                                                                                    request.ProductPrice)),
                            OrderId = newCart.Id,
                            ProductId = request.ProductId,
                            Note = request.Note
                        };
                        _context.OrderItem.Add(dbOrderItem);
                        _context.SaveChanges();

                        orderItemId = dbOrderItem.Id;
                        UpdateOrderItemColours(orderItemId, request.OrderItemColours);
                    }
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return orderItemId;
        }
        public async Task<bool> SendOrder(SendOrderRequest request)
        {
            try
            {
                var order = _context.Order.FirstOrDefault(or => (or.Id == request.OrderId || or.UserId == request.UserID)
                                                              && or.StatusId == (int)MarketCoreGeneral.Enums.OrderStatusId.Cart);

                if (order != null)
                {
                    var orderCustomer = _context.Customer.FirstOrDefault(cust => cust.Id == order.CustomerId);
                    var globalUserId = 1;
                    if (orderCustomer != null && order.CustomerId != globalUserId)



                        if (orderCustomer != null)
                        {
                            orderCustomer.Name = request.CustomerName;
                            orderCustomer.Tel1 = request.CustomerTel;
                            orderCustomer.Notes = request.Notes;
                            orderCustomer.Address = request.Address;
                        }
                        else
                        {
                            orderCustomer = new SqlCustomer()
                            {
                                Name = request.CustomerName,
                                Tel1 = request.CustomerTel,
                                Notes = request.Notes,
                                Address = request.Address
                            };
                            _context.Customer.Add(orderCustomer);
                        }

                    _context.SaveChanges();

                    order.CustomerId = orderCustomer.Id;
                    order.StatusId = (int)MarketCoreGeneral.Enums.OrderStatusId.Accepted;
                    order.UserId = null;
                    _context.SaveChanges();
                    if(request.Notes != null) order.Notes = request.Notes;
                    var orderModel = _mapper.Map<OrderModel>(order);
                    _mailer.SendSmsToSeller(orderModel);
                    return true;
                }
                else
                {
                    return false;
                }

            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<int> SaveOrder(OrderModel saveOrder)
        {
            try
            {
                var dbOrder = _context.Order.FirstOrDefault(o => o.Id == saveOrder.Id);
                if (dbOrder != null)
                {
                    //update exist order

                    dbOrder.CreateDate = saveOrder.CreateDate;
                    dbOrder.StatusId = saveOrder.StatusId;
                    dbOrder.Address = saveOrder.Address;
                    dbOrder.Discount = saveOrder.Discount;
                    dbOrder.DeleveryPrice = saveOrder.DeleveryPrice;
                    dbOrder.Notes = saveOrder.Notes;

                    //Update CustomerDetails
                    var orderCustomer = _context.Customer.FirstOrDefault(cust => cust.Id == dbOrder.CustomerId);

                    orderCustomer.Id = saveOrder.Customer.Id;
                    orderCustomer.Name = saveOrder.Customer.Name;
                    orderCustomer.Tel1 = saveOrder.Customer.Tel1;
                    orderCustomer.Tel2 = saveOrder.Customer.Tel2;
                    orderCustomer.Address = saveOrder.Customer.Address;
                    orderCustomer.Email = saveOrder.Customer.Email;
                    orderCustomer.Notes = saveOrder.Customer.Notes;

                    //Update order Items
                    List<int> newItemsIds = new List<int>();
                    foreach (var saveOrderItem in saveOrder.OrderItems)
                    {
                        var dbOrderItem = _context.OrderItem.FirstOrDefault(or => or.Id == saveOrderItem.Id);

                        if (dbOrderItem != null && saveOrderItem.Quantity > 0)
                        {
                            dbOrderItem.Quantity = saveOrderItem.Quantity;
                            dbOrderItem.UnitPrice = saveOrderItem.UnitPrice;
                            UpdateOrderItemColours(saveOrderItem.Id, saveOrderItem.Colours);
                        }
                        else if (dbOrderItem != null && saveOrderItem.Quantity == 0)
                        {

                            _context.OrderItemColour.RemoveRange(_context.OrderItemColour.Where(ocl => ocl.OrderItemId == dbOrderItem.Id));


                            var removedItem = _context.OrderItem.FirstOrDefault(oi => oi.Id == dbOrderItem.Id);
                            if (removedItem != null)
                            {
                                _context.OrderItem.Remove(removedItem);
                            }
                        }
                        else
                        {
                            var newOrderItem = new SqlOrderItem
                            {
                                Quantity = saveOrderItem.Quantity,
                                UnitPrice = saveOrderItem.UnitPrice,
                                OrderId = saveOrder.Id,
                                ProductId = saveOrderItem.Product.Id,
                                Note = saveOrderItem.Note
                            };
                            _context.OrderItem.Add(newOrderItem);
                            _context.SaveChanges();
                            newItemsIds.Add(newOrderItem.Id);
                            UpdateOrderItemColours(newOrderItem.Id, saveOrderItem.Colours);
                        }
                    }

                    //var itemIdsToDelete = _context.OrderItem.Where(oi => oi.OrderId == saveOrder.Id
                    //                                             && !saveOrder.OrderItems.Any(soi => soi.Id == oi.Id)
                    //                                             && !newItemsIds.Any(itId => itId == oi.Id)
                    //                                             ).Select(oi => oi.Id).ToList();
                    var itemIdsToDelete = _context.OrderItem
                        .Where(oi => oi.OrderId == saveOrder.Id)
                        .Select(oi => oi.Id)
                        .ToList();

                    // Use in-memory list to determine which items to delete
                    var idsToDelete = itemIdsToDelete
                        .Where(id => !saveOrder.OrderItems.Any(soi => soi.Id == id) &&
                                     !newItemsIds.Any(itId => itId == id))
                        .ToList();
                    //var colourToDelete = _context.OrderItemColour.Where(c => itemIdsToDelete.Contains(c.OrderItemId)).ToList();
                    var colourToDelete = _context.OrderItemColour
                            .Where(c => idsToDelete.Contains(c.OrderItemId))
                            .ToList();

                    _context.OrderItemColour.RemoveRange(colourToDelete);

                    _context.OrderItem.RemoveRange(_context.OrderItem.Where(oi => idsToDelete.Contains(oi.Id)));
                    //context.SaveChanges();

                }
                else
                {
                    // create new order
                    var sqlOrder = _mapper.Map<SqlOrder>(saveOrder);
                    _context.Order.Add(sqlOrder);
                }
                _context.SaveChanges();
                return dbOrder.Id;
            }
            catch (Exception ex)
            {
                var requestData = JsonConvert.SerializeObject(saveOrder);
                _logger.LogError("OrderServices.SaveOrder", null, -1, "", ex.Message, requestData);
                return -1;
            }
        }

        public async Task<List<OrderModel>> GetOrders(GetOrderRequest request)
        {

            try
            {
                var orderCustomer = _context.Customer.FirstOrDefault(cust =>
                    cust.Id == request.CustomerId
                    || (!string.IsNullOrEmpty(request.CustomerTel) && (cust.Tel1 == request.CustomerTel || cust.Tel2 == request.CustomerTel))
                    || (!string.IsNullOrEmpty(request.CustomerName) && (cust.Name == request.CustomerName))
                );

                var _orders = _context.Order.Where(ord => (ord.Id == request.OrderId)
                                                       || (ord.CustomerId == request.CustomerId)
                                                       || (orderCustomer != null && ord.CustomerId == orderCustomer.Id)
                                                       || (ord.StatusId == request.StatusId)
                                                        ).ToList();
                if (_orders != null && _orders.Any())
                {
                    var orders = _mapper.Map<IEnumerable<OrderModel>>(_orders);
                    return orders.OrderByDescending(o => o.Id).ToList();
                }
                return null;
            }
            catch (Exception ex)
            {
                var requestData = JsonConvert.SerializeObject(request);
                _logger.LogError("OrderServices.GetOrders", null, -1, "", ex.Message, requestData);
                throw;
            }
        }

        private void UpdateOrderItemColours(int orderItemId, List<string> colours)
        {
            if (colours != null && colours.Any())
            {
                var orderItem = _context.OrderItem.FirstOrDefault(pr => pr.Id == orderItemId);
                if (orderItem != null)
                {
                    foreach (var colourCode in colours)
                    {
                        if (!_context.OrderItemColour.Any(clr => clr.OrderItemId == orderItem.Id && clr.Code == colourCode))
                        {
                            _context.OrderItemColour.Add(new SqlOrderItemColour { Code = colourCode, OrderItemId = orderItem.Id });
                        }
                    }
                    _context.OrderItemColour.RemoveRange(_context.OrderItemColour.Where(pc => !colours.Contains(pc.Code)));
                    _context.SaveChanges();
                }
            }
        }

        public Task<OrderModel?> GetEmptyCart(string userId)
        {
            var emptyCart = new OrderModel()
            {
                Id = 0,
                UserId = userId,
                CustomerId = 0,
                Address = "",
                Customer = null,
                CreateDate = DateTime.Now,
                DeleveryPrice = 0,
                Discount = 0,                
                Notes = null,
                OrderItems = new List<OrderItemModel>(),
                StatusId = 1,//Cart
            };
            return Task.FromResult(emptyCart);
        }
    }
}

