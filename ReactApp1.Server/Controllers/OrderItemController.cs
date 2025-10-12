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
