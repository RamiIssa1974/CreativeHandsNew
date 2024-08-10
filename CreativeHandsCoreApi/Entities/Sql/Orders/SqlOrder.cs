using CreativeHandsCoreApi.Entities.Sql.Customers;
using MarketCoreGeneral.Models.Customers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CreativeHandsCoreApi.Entities.Sql.Orders
{
    public class SqlOrder
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string? UserId { get; set; }
        public int StatusId { get; set; }
        public decimal DeleveryPrice { get; set; }
        public System.DateTime CreateDate { get; set; }
        public string? Address { get; set; }
        public string? Notes { get; set; }
        public decimal Discount { get; set; }                

    }
}