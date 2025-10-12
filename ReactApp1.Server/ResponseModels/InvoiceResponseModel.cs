using ReactApp1.Server.Database.Models;

namespace ReactApp1.Server.ResponseModels
{
    public class InvoiceResponseModel
    {
        public Invoice InvoiceData { get; set; }

        public bool? IsNew { get; set; }
    }
}
