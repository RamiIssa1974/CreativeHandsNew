using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CreativeHandsCoreApi.Entities.Sql.Products
{
    public class SqlProductCategory
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int CategoryId { get; set; }
    }
}