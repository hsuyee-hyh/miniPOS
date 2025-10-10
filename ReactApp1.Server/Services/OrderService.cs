

using ReactApp1.Server.Database.Models;
using ReactApp1.Server.Models;

namespace ReactApp1.Server.Services
{
    public class OrderService
    {

        public void GetOrder(int customerId)
        {
            if (customerId.Equals(null) || customerId.Equals(0))
            {
                throw new Exception("CustomerId cannot be null or zero.");
            }
        }
        public void CreateOrder(OrderDto requestOrder)
        {
            if (string.IsNullOrWhiteSpace(requestOrder.Product)
                || requestOrder.SellingPrice.Equals(null)
                || requestOrder.ProductId.Equals(null)
                || requestOrder.AdditionalSellingPrice.Equals(null)
                || requestOrder.LabourCost.Equals(null)
                || requestOrder.VehicleCost.Equals(null)
                || requestOrder.TotalSellingCost.Equals(null)
                || requestOrder.Quantity.Equals(null)
                || requestOrder.CustomerId.Equals(null)
                )
            {
                throw new Exception("All fields are required.");
            }


        }

        public void EditOrderById(int customerId, int orderId)
        {
            if (customerId.Equals(null) || customerId == 0)
            {
                throw new Exception("CustomerId cannot be null or zero.");
            }

            if (orderId.Equals(null) || orderId == 0)
            {
                throw new Exception("OrderId cannot be null or zero.");
            }
        }

        public void updateOrder(Order requestOrder)
        {
            if (requestOrder.Id.Equals(null) || requestOrder.Id == 0
                || string.IsNullOrWhiteSpace(requestOrder.Product)
                || requestOrder.SellingPrice.Equals(null) || requestOrder.SellingPrice.Equals(0)
                || requestOrder.ProductId.Equals(null) || requestOrder.ProductId == 0
                || requestOrder.LabourCost.Equals(null) || requestOrder.LabourCost== 0
                || requestOrder.VehicleCost.Equals(null) || requestOrder.VehicleCost== 0
                || requestOrder.TotalSellingCost.Equals(null) || requestOrder.TotalSellingCost== 0
                || requestOrder.Quantity.Equals(null) || requestOrder.Quantity== 0
                || requestOrder.CustomerId.Equals(null) || requestOrder.CustomerId == 0
                )
            {
                throw new Exception("All fields cannot be null or zero");

            }
        }
    }
}
