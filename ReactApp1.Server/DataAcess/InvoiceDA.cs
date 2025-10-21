using Microsoft.AspNetCore.Http.HttpResults;
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

        public async Task<List<InvoiceDto>> getInvoiceListAsync()
        {
            var invoiceList = await _context.Invoices
                .Include(i => i.Customer)
                .Select(i => new InvoiceDto
                {
                    InvoiceId = i.InvoiceId,
                    TotalBalance = i.TotalBalance,
                    PaidAmount  = i.PaidAmount,
                    RemainingBalance = i.RemainingBalance,
                    CreatedDate = i.CreatedDate,
                    CreatedBy = i.CreatedBy,
                    CustomerId = i.CustomerId,
                    OrderItemId = i.OrderItemId,
                    CustomerName = i.Customer.CustomerName,
                })
                .ToListAsync();
            return invoiceList;
        }
        public async Task<InvoiceResponseModel> getInvoiceByInvoiceIdAsync (string invoiceId)
        {
            List<Invoice> invoices =  await _context.Invoices
                .Where(x => x.InvoiceId == invoiceId)
                .ToListAsync();
            return new InvoiceResponseModel
            {
                InvoiceDataList = invoices,
            };
        }


        public async Task<InvoiceResponseModel> getInvoiceByCustomerIdAsync (string invoiceId, int customerId)
        {
            // find Invoice
            var createdInvoiceList = await _context.Invoices
                .Where(x => x.InvoiceId == invoiceId)
                .ToListAsync();

                
            // find invoices that its paid amount is not zero
            var invoices = await _context.Invoices
                .Where(x => x.CustomerId == customerId && x.RemainingBalance != 0)
                .ToListAsync();
           
            // add to list
            //List<Invoice> invoiceList = new List<Invoice>();
            //invoices.ForEach(inv =>
            //{
            //    invoiceList.Add(new Invoice { InvoiceId = inv.InvoiceId, PaidAmount = inv.PaidAmount });
            //});

            return new InvoiceResponseModel {
                CreatedInvoiceDataList = createdInvoiceList,
                InvoiceDataList = invoices,
            };
        }
        public async Task<InvoiceResponseModel> createInvoiceAsync(List<InvoiceDto> invoiceRequestDto)
        {
            // find invoice
            foreach(var i in invoiceRequestDto)
            {
                var foundInvoice = await _context.Invoices.FirstOrDefaultAsync(
                    x => x.CustomerId == i.CustomerId && 
                    x.OrderItemId == i.OrderItemId 
                    //x.CreatedDate == DateTimeOffset.Now
                  );
                if (foundInvoice != null)
                {
                    return new InvoiceResponseModel
                    {
                        InvoiceData = foundInvoice,
                        IsNew = false,
                    };
                }

                var invoice = new Invoice
                {
                    InvoiceId = i.InvoiceId,
                    TotalBalance = i.TotalBalance,
                    PaidAmount = i.PaidAmount,
                    RemainingBalance = i.RemainingBalance,
                    CreatedDate = DateTime.UtcNow,
                    CreatedBy = "Admin",
                    CustomerId = i.CustomerId,
                    OrderItemId = i.OrderItemId,
                    
                };
                await _context.AddAsync(invoice);
                var result = await _context.SaveChangesAsync();

                // Get the OrderItem related to this invoice
                var orderItem = await _context.OrderItems
                    .FirstOrDefaultAsync(oi => oi.Id == i.OrderItemId);
                if (orderItem is null)
                {
                    throw new Exception("OrderItem not found to mark as invoice generated.");
                }
                // Update the flag
                orderItem.IsGeneratedInvoice = true;

                // define order.IsGeneratedInvoice true
                var order =await _context.Orders
                    .FirstOrDefaultAsync(x => x.Id == orderItem.OrderId);
                if(order is null)
                {
                    throw new Exception("Order is not found to defined as invoice generated.");
                };
                order.IsGeneratedInvoice = true;
                _context.SaveChanges();                
            }
               
            return new InvoiceResponseModel
            {
                //InvoiceData = invoice,
                IsNew = true,
            };
                
        }

        public async Task<InvoiceResponseModel> updateInvoiceAsync(InvoiceUpdateDto invoiceUpdateRequestDto)
        {
            // find 
            var foundInvoices = await _context.Invoices
                .Where(x => x.InvoiceId == invoiceUpdateRequestDto.InvoiceId)
                .ToListAsync();

            if(foundInvoices is null)
            {
                return new InvoiceResponseModel
                {
                    InvoiceDataList = foundInvoices,
                };
            }

            // update
            foreach(var foundInvoice in foundInvoices)
            {
                foundInvoice.TotalBalance = invoiceUpdateRequestDto.TotalBalance;
                foundInvoice.PaidAmount = invoiceUpdateRequestDto.PaidAmount;
                foundInvoice.RemainingBalance = invoiceUpdateRequestDto.RemainingBalance;
                foundInvoice.CreatedDate = DateTime.UtcNow;
                foundInvoice.CreatedBy = "Admin";
                foundInvoice.CustomerId = invoiceUpdateRequestDto.CustomerId;
            }
            
            
            var result = await _context.SaveChangesAsync();
            //if(result <= 0)
            //{
            //    throw new Exception("Failed to update Invoice.");
            //}
            return new InvoiceResponseModel
            {
                InvoiceDataList = foundInvoices,
            };
        }
    }
}
