using MarketCoreGeneral.Models.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CreativeHandsCoreApi.Entities.Sql.Products
{
    public class SqlProductAvailableColours
    {
        public int Id { get; set; }
        public int ProductId { get; set; }

        public string Code { get; set; }
    }
}