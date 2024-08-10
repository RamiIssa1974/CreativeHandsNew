using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketCoreGeneral.Responses
{
    public class UploadFilesResponse
    {
        public int VideoId { get; set; }
        public int ProductId { get; set; }
        public int PurchaseId { get; set; }
        public List<string> UploadedImages { get; set; }
    }
}
