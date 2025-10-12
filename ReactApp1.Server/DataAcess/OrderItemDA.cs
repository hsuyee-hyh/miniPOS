using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Database;
using ReactApp1.Server.Database.Models;
using ReactApp1.Server.Models;
using System.Threading.Tasks;

namespace ReactApp1.Server.DataAcess
{
    public class OrderItemDA
    {

        private readonly AppDbContext _context;
        public OrderItemDA(AppDbContext context)
        {
            _context = context;
        }

        // create
        public async Task<int> createOrderItemAsync(List<OrderItemDto> orderItemDtoRequest)
        {
            var result = 0;
            foreach(var dto in orderItemDtoRequest)
            {
                // find
                var foundOrderItem = await _context.OrderItems.FirstOrDefaultAsync(
                     x => x.OrderId == dto.OrderId
                    );
                if (foundOrderItem != null)
                {
                    throw new Exception($"OrderItem is aleray existed with that order id, {dto.OrderId}");
                }

                var orderItem = new OrderItem
                {
                    OrderId = dto.OrderId,
                    ProductId = dto.ProductId,
                    Product = dto.Product,
                    TotalSellingCost = dto.TotalSellingCost,
                    Quantity = dto.Quantity,
                    Balance = dto.Balance,
                    CustomerId = dto.CustomerId,
                };

                await _context.OrderItems.AddAsync(orderItem);
                result = await _context.SaveChangesAsync();
            }
            return result;
        }
    }
}
