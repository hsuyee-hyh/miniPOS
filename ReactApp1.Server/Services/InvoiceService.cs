using ReactApp1.Server.RequestModels;
using System.Numerics;

namespace ReactApp1.Server.Services
{
    public class InvoiceService
    {
        public void checkInvoiceData(List<InvoiceDto> invoiceRequestDto)
        {
            if(invoiceRequestDto is null)
            {
                throw new Exception("Invoice data cannot be null");
            }

           
            foreach(var i in invoiceRequestDto)
            {
                if(i.InvoiceId is null)
                {
                    throw new Exception("Invoice Id cannot be null.");
                }
                else if (i.TotalBalance <= 0)
                {
                    throw new Exception("Total Balance cannot be null or negative");
                }
                else if (i.PaidAmount < 0)
                {
                    throw new Exception("Paid amount cannot be null or negative");
                }
                else if (i.RemainingBalance < 0)
                {
                    throw new Exception("Remaining Balance cannot be null or negative");
                }
                else if (i.CustomerId <= 0)
                {
                    throw new Exception("CustomerId cannot be null or negative");
                }
            }
            
        }

        public void checkInvoiceUpdateData(InvoiceUpdateDto invoiceUpdateRequestDto)
        {
            if (invoiceUpdateRequestDto is null)
            {
                throw new Exception("Invoice data to update cannot be null");
            }

            if(invoiceUpdateRequestDto.Id <= 0)
            {
                throw new Exception("Invoice Id cannot be null or negative.");
            }
            else if (invoiceUpdateRequestDto.TotalBalance <= 0)
            {
                throw new Exception("Total Balance for update cannot be null or negative");
            }
            else if (invoiceUpdateRequestDto.PaidAmount <= 0)
            {
                throw new Exception("Paid amount for update cannot be null or negative");
            }
            else if (invoiceUpdateRequestDto.RemainingBalance < 0)
            {
                throw new Exception("Remaining Balance for update cannot be null or negative");
            }
            else if (invoiceUpdateRequestDto.CustomerId <= 0)
            {
                throw new Exception("CustomerId cannot for update be null or negative");
            }
        }

        public string checkInvoiceId(string invoiceId)
        {
            if(invoiceId is null || string.IsNullOrWhiteSpace(invoiceId))
            {
                throw new Exception("InvoiceId cannot be null");
            }
            return invoiceId;
        }

        public int checkCustomerId (string customerId)
        {
            if(int.Parse(customerId) < 0)
            {
                throw new Exception("Customer Id cannot be zero or negative");
            }
            return int.Parse(customerId);
        }
    }
}
