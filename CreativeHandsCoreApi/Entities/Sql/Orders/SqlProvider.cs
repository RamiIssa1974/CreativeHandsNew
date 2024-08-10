
using MarketCoreGeneral.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CreativeHandsCoreApi.Entities.Sql.Orders
{
    public class SqlProvider
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? IdN { get; set; }
        public string? Tel1 { get; set; }
        public string? Tel2 { get; set; }
        public string? Address { get; set; }
        public string? Description { get; set; }         
        public string? WebSite { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; }
    }
}