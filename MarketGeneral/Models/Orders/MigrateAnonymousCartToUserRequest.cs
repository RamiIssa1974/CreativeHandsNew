using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketCoreGeneral.Models.Orders
{
    public class MigrateAnonymousCartToUserRequest
    {
        public string? CartToken { get; set; }
        public string? UserId { get; set; }
    }
}
