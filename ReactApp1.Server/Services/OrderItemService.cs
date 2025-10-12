using ReactApp1.Server.Models;

namespace ReactApp1.Server.Services
{
    public class OrderItemService
    {
        public void createOrderItem(List<OrderItemDto> orderItemDtoRequest)
        { 
            if(orderItemDtoRequest == null)
            {
                throw new Exception("Order Item request cannot be null.");
            }

            if(orderItemDtoRequest.Count < 1)
            {
                throw new Exception("There hasn't any order item.");
            }

            foreach (var orderItem in orderItemDtoRequest)
            {
                if (orderItem.OrderId <= 0)
                {
                    throw new Exception("Order id cannot be 0 or negative value");
                }
                else if (orderItem.ProductId <= 0)
                {
                    throw new Exception("Product id cannot be 0 or negative value");
                }
                else if (string.IsNullOrWhiteSpace(orderItem.Product))
                {
                    throw new Exception("Product name cannot be null");
                }
                else if (orderItem.TotalSellingCost <= 0)
                {
                    throw new Exception("Total Selling Cost cannot be 0 or negative value");
                }
                else if (orderItem.Quantity <= 0)
                {
                    throw new Exception("Quantity cannot be 0 or negative value");
                }
                else if(orderItem.Balance <= 0)
                {
                    throw new Exception("Balance cannot be 0 or negative value");
                }
                else if (orderItem.CustomerId <= 0)
                {
                    throw new Exception("CustomerId cannot be 0 or negative value");
                }
               
            }
        }
    }
}
