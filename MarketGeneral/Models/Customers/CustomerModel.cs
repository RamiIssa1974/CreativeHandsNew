using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MarketCoreGeneral.Models.Authintication;

namespace MarketCoreGeneral.Models.Customers
{
    public class CustomerModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Tel1 { get; set; }
        public string? Tel2 { get; set; } = null;
        public string Address { get; set; }
        public UserModel? User { get; set; } = null;
        public string? Notes { get; set; } = null;
        public string? Email { get; set; }= null;
    }
}
