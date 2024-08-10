using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketCoreGeneral.Enums
{
    public enum OrderStatusId
    {
        Cart = 1,
        Accepted = 2,// read by an admin
        Prepared = 3,//prepared by stuf and ready to send
        Sent = 4,//sent and received by the customer
        Paid = 5,//paid by the customer
        Canceled = 6,
        Closed = 7//Fineshed
    }
}
