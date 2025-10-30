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

        public async Task<List<OrderItem>> getOrderItemsAsync(List<int> id)
        {
            var orderItemList = await _context.OrderItems
                .Where(x => id.Contains(x.Id))
                .ToListAsync();
            return orderItemList;
        }

        // read
        public async Task<List<OrderItem>> searchOrderItemsByOrderIdsAsync(List<int> orderIds)
        {
            List<OrderItem> orderItems = await _context.OrderItems
                .Where(x => orderIds.Contains(x.OrderId))
                .ToListAsync();
            return orderItems;
        }

        // create
        public async Task<int> createOrderItemAsync(List<OrderItemDto> orderItemDtoRequest)
        {
            var result = 0;
            
            foreach(var dto in orderItemDtoRequest)
            {
                // assign order 
                var order = await _context.Orders
                    .FirstOrDefaultAsync(x => x.Id == dto.OrderId);

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
                    UnitLevel = dto.UnitLevel,
                    Balance = dto.Balance,
                    CustomerId = dto.CustomerId,
                    CreatedDate = DateTimeOffset.Now,
                    CreatedBy = "Admin",
                    IsGeneratedInvoice = false,
                    Order = order!,
                };

                await _context.OrderItems.AddAsync(orderItem);
                result = await _context.SaveChangesAsync();
            }
            return result;
        }
    }
}
