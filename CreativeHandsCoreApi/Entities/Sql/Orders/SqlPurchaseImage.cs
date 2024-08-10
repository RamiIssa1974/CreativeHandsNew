using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CreativeHandsCoreApi.Entities.Sql.Orders
{
    public class SqlPurchaseImage
    {
       
        public int Id { get; set; }
        public int PurchaseId { get; set; }        
        public string Extension { get; set; }
    }
}
 