using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Database;

namespace ReactApp1.Server.DataAcess
{
    public class CustomerDA
    {

        private readonly AppDbContext _context;
        public CustomerDA(AppDbContext context)
        {
            _context = context;
        }

        public int deleteCustomerDetail(int customerId)
        {
            // define orderItem to null in Invoice
            var invoices = _context.Invoices
                .Where(i => i.CustomerId == customerId)
                .ToList();
            foreach(var inv in invoices)
            {
                inv.OrderItemId = null;
            }
            _context.SaveChanges();


            var customer = _context.Customers
                .Include(c => c.Orders)
                    .ThenInclude(o => o.OrderItem)
                .FirstOrDefault(x => x.Id == customerId);

            if (customer == null)
            {
                return -1 ;
            }

            _context.Customers.Remove(customer);
            var result = _context.SaveChanges();
            return result;

        }

    }
}
