using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Database;
using ReactApp1.Server.Database.Models;
using ReactApp1.Server.Models;
using ReactApp1.Server.Services;
using System.Threading.Tasks;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly OrderService _orderService;
        public OrderController(AppDbContext context, OrderService orderService)
        {
            _context = context;
            _orderService = orderService;
        }

        // get order by customerId
        [HttpGet]
        public async Task<IActionResult> GetOrders([FromQuery] string customerId)
        {
            int id = int.Parse(customerId);
            _orderService.GetOrder(id);

            List<Order> orders = await _context.Orders
                .Where(x => x.CustomerId == id)
                .OrderByDescending(x => x.Id)
                .ToListAsync();

            if (orders.Count == 0)
            {
                return NotFound("Orders cannot be found");
            }

            return Ok(orders);
        }

        // get order by customerId
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetInvoicedOrders(string customerId)
        {
            int id = int.Parse(customerId);
            _orderService.GetOrder(id);

            List<Order> orders = await _context.Orders
                .Where(x => x.CustomerId == id && x.IsGeneratedInvoice== false)
                .OrderByDescending(x => x.Id)
                .ToListAsync();

            if (orders.Count == 0)
            {
                return NotFound(new
                {
                    error = "Orders cannot be found",
                });
            }

            return Ok(orders);
        }

        [HttpPost("create-order")]
        public async Task<IActionResult> CreateOrderAsync( [FromBody] OrderDto requestOrder)
        {
            _orderService.CreateOrder(requestOrder);

            // customer
            var customer = await _context.Customers
                .FirstOrDefaultAsync(x => x.Id == requestOrder.CustomerId);

            // product
            var product = await _context.Products
                .FirstOrDefaultAsync(x => x.Id == requestOrder.ProductId);
            // check stock
            if(requestOrder.UnitLevel == product.Lvl1Unit)
            {
                if(product.StockLvl1 <= 0)
                {
                    return BadRequest(new
                    {
                        error = "Not enough stock level"
                    });
                }
            }else if(requestOrder.UnitLevel == product.Lvl2Unit)
            {
                if(product.StockLvl2 <= 0 && product.StockLvl1 <= 0)
                {
                    return BadRequest(new
                    {
                        error = "Not enough stock level"
                    });
                }
            }else if(requestOrder.UnitLevel == product.Lvl3Unit)
            {
                if(product.StockLvl3 <= 0 && product.StockLvl3 <= 0)
                {
                    return BadRequest(new
                    {
                        error = "Not enough stock level"
                    });
                }
            }

                var order = new Order
                {
                    Product = requestOrder.Product,
                    SellingPrice = requestOrder.SellingPrice,
                    ProductId = requestOrder.ProductId,

                    AdditionalSellingPrice = requestOrder.AdditionalSellingPrice,
                    LabourCost = requestOrder.LabourCost,
                    VehicleCost = requestOrder.VehicleCost,
                    TotalSellingCost = requestOrder.TotalSellingCost,
                    Quantity = requestOrder.Quantity,
                    UnitLevel = requestOrder.UnitLevel,
                    CreatedDate = DateTimeOffset.Now,
                    CreatedBy = "Admin",
                    IsGeneratedInvoice = false,

                    CustomerId = requestOrder.CustomerId,
                    Customer = customer,
                };
            var createdOrder = await _context.Orders.AddAsync(order);
            var result = await _context.SaveChangesAsync();

            if (result < 1)
            {
                return BadRequest(new
                {
                    error = "Failed to create the order",
                });
            }
            return Ok(new { success = "Order is successfully created" });
        }

     
        // get order by orderid
        [HttpGet("customer/{customerId}/edit/{orderId}")]
        public async Task<IActionResult> EditOrderById( int customerId, int orderId)
        {
            try
            {
                _orderService.EditOrderById(customerId, orderId);

                var foundOrder = await _context.Orders
                    .FirstOrDefaultAsync(x => x.CustomerId == customerId && x.Id == orderId);

                if (foundOrder is null)
                {
                    return NotFound("Order not found with that customerId or orderId");
                }

                return Ok(foundOrder);
            }catch(Exception ex)
            {
                return StatusCode(500, $"Error occurs while fetching order by id: {ex.Message}");
            }
        }


        [HttpPut("edit/customer/{customerId}/order/{orderId}")]
        public async Task<IActionResult> UpdateOrder([FromForm] Order requestOrder)
        {
            try
            {
                _orderService.updateOrder(requestOrder);
                var foundOrder = await _context.Orders.FirstOrDefaultAsync(x => x.Id == requestOrder.Id && x.CustomerId == requestOrder.CustomerId);
                if(foundOrder is null)
                {
                    return NotFound("Order not found.");
                }

                foundOrder.Id = requestOrder.Id;
                foundOrder.Product = requestOrder.Product;
                foundOrder.SellingPrice  = requestOrder.SellingPrice;
                foundOrder.ProductId = requestOrder.ProductId;
                foundOrder.AdditionalSellingPrice = requestOrder.AdditionalSellingPrice;
                foundOrder.LabourCost = requestOrder.LabourCost;
                foundOrder.VehicleCost = requestOrder.VehicleCost;
                foundOrder.TotalSellingCost = requestOrder.TotalSellingCost;
                foundOrder.Quantity = requestOrder.Quantity;
                foundOrder.CustomerId = requestOrder.CustomerId;
                foundOrder.CreatedDate = DateTime.UtcNow;

                var result = await _context.SaveChangesAsync();
                if(result < 1)
                {
                    return BadRequest("Failed to update order.");
                }

                return Ok(foundOrder);
            } catch (Exception ex)
            {
                return StatusCode(500, $"Failed to update order data: {ex.Message} ");
            }
        }


        [HttpDelete("delete/customer/{customerId}/order/{orderId}")]
        public async Task<IActionResult> DeleteOrder(int customerId, int orderId)
        {
            try
            {
                _orderService.EditOrderById(customerId, orderId);

                var foundOrder = await _context.Orders.FirstOrDefaultAsync(x => x.Id == orderId && x.CustomerId == customerId);
                if(foundOrder is null)
                {
                    return NotFound("Order not found");
                }

                _context.Orders.Remove(foundOrder);
                var result = await _context.SaveChangesAsync();
                if(result < 1)
                {
                    return BadRequest("Failed to delete the order.");
                }
                return Ok(result);
            }catch(Exception ex)
            {
                return StatusCode(500, $"An error occured during delete the order: {ex.Message}");
            }
        }

    }
}
