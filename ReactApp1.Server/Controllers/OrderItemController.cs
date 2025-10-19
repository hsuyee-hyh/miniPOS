using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.DataAcess;
using ReactApp1.Server.Database;
using ReactApp1.Server.Database.Models;
using ReactApp1.Server.Models;
using ReactApp1.Server.Services;
using System.Threading.Tasks;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemController : ControllerBase
    {
        
        private readonly OrderItemService _orderItemService;
        private readonly OrderItemDA _orderItemDA;

        public OrderItemController( OrderItemService orderItemService, OrderItemDA orderItemDA)
        {
           
            _orderItemService = orderItemService;
            _orderItemDA = orderItemDA;
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetOrderItems([FromQuery] List<int> id)
        {
            try
            {
                if (id is null || id.Count == 0)
                {
                    throw new Exception("Id cannot be null or zero.");
                }
                var orderItemList = await _orderItemDA.getOrderItemsAsync(id);
                if(orderItemList is null || orderItemList.Count == 0)
                {
                    return NotFound(new
                    {
                        error = "Order Items are not found"
                    });
                }

                return Ok(new
                {
                    success = "Order Items are found",
                    orderItemList = orderItemList
                });
            }catch(Exception ex)
            {
                return BadRequest(new
                {
                    error = ex.Message,
                });
            }
        }

        [HttpPost("orderids")]
        public async Task<IActionResult> searchOrderItemsByOrderIds([FromBody] List<int> orderIds)
        {
            try
            {
                _orderItemService.checkOrderIdList(orderIds);
                List<OrderItem> orderItemList = await _orderItemDA.searchOrderItemsByOrderIdsAsync(orderIds);

                if(orderItemList is null || orderItemList.Count == 0)
                {
                    return NotFound(new
                    {
                        error = "Order not found."
                    });
                }

                return Ok(new
                {
                    success = $"One or more order items are found.",
                    orderItems = orderItemList,
                });
            }catch(Exception ex)
            {
                return BadRequest(new
                {
                    error = $"Error occured while getting orderItems: {ex.Message}",
                });
            }
        }


        [HttpPost("create-orderitem")]
        public async Task<IActionResult> createOrderItem([FromBody] List<OrderItemDto> orderItemDtoRequest)
        {
            try
            {
                _orderItemService.createOrderItem(orderItemDtoRequest);
                var result = await _orderItemDA.createOrderItemAsync(orderItemDtoRequest);

                if (result < 1)
                {
                    return BadRequest("Failed to create order item.");
                }              
                return Ok(new {success = "Order item is inserted successfully" });
            }
            catch(Exception ex)
            {
                return BadRequest(new {error = ex.Message});
            }
            
        }
    }
}
