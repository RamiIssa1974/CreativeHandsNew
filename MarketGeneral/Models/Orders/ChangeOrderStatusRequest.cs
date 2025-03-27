using MarketCoreGeneral.Models.Customers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MarketCoreGeneral.Models.Orders
{
    public class ChangeOrderStatusRequest
    {
        public int Id { get; set; }
         
        public int StatusId { get; set; }
          
    }
}