using MarketCoreGeneral.Models.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CreativeHandsCoreApi.Entities.Sql.Orders
{
    public class SqlOrderItemColour
    {
        public int Id { get; set; }
        public int OrderItemId { get; set; }

        public string Code { get; set; }
    }
}