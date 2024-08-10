using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MarketCoreGeneral.Models.Authintication;

namespace CreativeHandsCoreApi.Entities.Sql.Customers
{
    public class SqlCustomer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Tel1 { get; set; }
        public string? Tel2 { get; set; }
        public string Address { get; set; }
        public int? UserId { get; set; }
        public string? Notes { get; set; }
        public string? Email { get; set; }
    }
}
