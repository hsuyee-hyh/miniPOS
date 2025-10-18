using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Database;
using ReactApp1.Server.Database.Models;
using ReactApp1.Server.RequestModels;
using ReactApp1.Server.ResponseModels;
using System.Threading.Tasks;

namespace ReactApp1.Server.DataAcess
{
    public class InvoiceDA
    {
        private readonly AppDbContext _context;
        public InvoiceDA(AppDbContext context)
        {
            _context = context;
        }

        public async Task<InvoiceResponseModel> createInvoiceAsync(InvoiceDto invoiceRequestDto)
        {
            // find invoice
            var foundInvoice = await _context.Invoices.FirstOrDefaultAsync(
                    x => x.CustomerId == invoiceRequestDto.CustomerId && x.CreatedDate.Date == DateTime.UtcNow.Date
                  );
            if(foundInvoice != null)
            {
                return new InvoiceResponseModel
                {
                    InvoiceData = foundInvoice,
                    IsNew = false,
                };
            }

            var invoice = new Invoice
            {
                TotalBalance = invoiceRequestDto.TotalBalance,
                PaidAmount = invoiceRequestDto.PaidAmount,
                RemainingBalance = invoiceRequestDto.RemainingBalance,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = "Admin",
                CustomerId = invoiceRequestDto.CustomerId,
            };
            await _context.AddAsync(invoice);
            var result = await _context.SaveChangesAsync();
            if(result <= 0)
            {
                throw new Exception("Failed to create Invoice.");
            }
            return new InvoiceResponseModel
            {
                InvoiceData = invoice,
                IsNew = true,
            };
                
        }
    }
}
