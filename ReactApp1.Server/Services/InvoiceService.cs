using ReactApp1.Server.RequestModels;

namespace ReactApp1.Server.Services
{
    public class InvoiceService
    {
        public void checkInvoiceData(InvoiceDto invoiceRequestDto)
        {
            if(invoiceRequestDto is null)
            {
                throw new Exception("Invoice data cannot be null");
            }

            if(invoiceRequestDto.TotalBalance <= 0)
            {
                throw new Exception("Total Balance cannot be null or negative");
            }else if(invoiceRequestDto.PaidAmount <= 0)
            {
                throw new Exception("Paid amount cannot be null or negative");
            }else if (invoiceRequestDto.RemainingBalance <= 0)
            {
                throw new Exception("Remaining Balance cannot be null or negative");
            }else if(invoiceRequestDto.CustomerId <= 0)
            {
                throw new Exception("CustomerId cannot be null or negative");
            }
        }
    }
}
