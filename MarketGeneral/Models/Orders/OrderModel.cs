using MarketCoreGeneral.Models.Customers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MarketCoreGeneral.Models.Orders
{
    public class OrderModel
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public int CustomerId { get; set; }
        public int StatusId { get; set; }
        public decimal DeleveryPrice { get; set; }
        public System.DateTime CreateDate { get; set; }
        public string? Address { get; set; } = null;
        public string? Notes { get; set; } = null;
        public decimal Discount { get; set; }
        public CustomerModel Customer { get; set; }
        public List<OrderItemModel> OrderItems { get; set; }

    }
}