using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CreativeHandsCoreApi.Entities.Sql.Products
{
    public class SqlProductVariation
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public decimal Price { get; set; }
                       
        public string Description { get; set; }         
    }
}
 