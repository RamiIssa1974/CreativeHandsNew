using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketCoreGeneral.Models
{
    public class SmsSettings
    {
        public string BaseUrl { get; set; }
        public string Token { get; set; }
        public string SellerTel { get; set; }
        public string SiteTel { get; set; }
        public int MaxSmsLength { get; set; }
        
    }
}
