using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.DataAcess;
using ReactApp1.Server.Database;
using ReactApp1.Server.Database.Models;
using ReactApp1.Server.Services;
using System.Threading.Tasks;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly CustomerService _customerService;
        private readonly CustomerDA _customerDA;

        public CustomerController(AppDbContext context, CustomerService customerService, CustomerDA customerDA)
        {
            _context = context;
            _customerService = customerService;
            _customerDA = customerDA;
        }

        [HttpGet("customers")]
        public async Task<IActionResult> GetCustomers()
        {
            List<Customer> customers = await _context.Customers.OrderByDescending(x=> x.Id).ToListAsync();
            if(customers is null)
            {
                return NotFound(new { message = "Customers not found." });
            }
            return Ok(customers);
        }

        [HttpGet("{customerId}")]
        public async Task<IActionResult> GetCustomerById(int customerId)
        {
            _customerService.GetCustomerById(customerId);
            try
            {
                var foundCustomer = await _context.Customers.FirstOrDefaultAsync(x => x.Id == customerId);
                if(foundCustomer == null)
                {
                    return BadRequest(new { error = "Customer not found with that ID" });
                }
                return Ok(new
                {
                    success = "Customer is found",
                    customer = foundCustomer,
                });
            }catch(Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("create-customer")]
        public async Task<IActionResult> CreateCustomer ([FromForm] Customer requestCustomer)
        {
            try
            {
                _customerService.CreateCustomer(requestCustomer);

                Customer foundCustomer = await _context.Customers.FirstOrDefaultAsync(x => x.CustomerCode == requestCustomer.CustomerCode);
                if (foundCustomer != null)
                {
                    return BadRequest(new { message = "User already existed with that CustomerCode." });
                }
                await _context.Customers.AddAsync(requestCustomer);
                var result = await _context.SaveChangesAsync();
                if (result < 1 )
                {
                    return BadRequest(new { message = "Failed to create customer." });
                }

                return Ok(new { message = "Successfully created customer." });

            }
            catch(Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpGet("edit/{customerId}")]
        public async Task<IActionResult> EditCustomerById(int customerId)
        {
            try
            {
                _customerService.GetCustomerById(customerId);
                var foundCustomer = await _context.Customers.FirstOrDefaultAsync(x => x.Id == customerId);
                if(foundCustomer is null)
                {
                    return NotFound(new { error = "Customer not found." });
                }

                return Ok( new { 
                    success = $"Customer is found with that {customerId}",
                    foundCustomer = foundCustomer,
                });

            }
            catch(Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


        [HttpPut("edit/{customerId}")]
        public async Task<IActionResult> UpdateCustomer (int customerId, Customer requestCustomer)
        {
            try
            {
                _customerService.UpdateCustomer(customerId, requestCustomer);

                var foundCustomer = _context.Customers.FirstOrDefault(x => x.Id == customerId);
                if(foundCustomer is null)
                {
                    return NotFound(new {error = "Customer not found." });
                }

                foundCustomer.CustomerCode = requestCustomer.CustomerCode;
                foundCustomer.CustomerName = requestCustomer.CustomerName;
                foundCustomer.CustomerPhone = requestCustomer.CustomerPhone;
                foundCustomer.CustomerAddress = requestCustomer.CustomerAddress;

                var result = await _context.SaveChangesAsync();
                if(result < 1)
                {
                    return BadRequest(new
                    {
                        error = "Failed to update customer."
                    });
                }
                return Ok(new { success = "Updated customer successfully.", customer = foundCustomer });
            }catch(Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpDelete("delete/{customerId}")]
        public async Task<IActionResult> DeleteCustomer(int customerId)
        {
            try
            {
                _customerService.DeleteCustomer(customerId);

                var foundCustomer = _context.Customers.FirstOrDefault(x => x.Id == customerId);
                if (foundCustomer is null)
                {
                    return NotFound(new { message = "Customer not found." });
                }
                _context.Customers.Remove(foundCustomer);
                var result = await _context.SaveChangesAsync();

                if(result < 1)
                {
                    return BadRequest("Failed to delete Customer.");
                }
                return Ok(new { message = "Successfully delete customer." });
            }catch(Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }

        }

        [HttpDelete("delete/{customerId}/detail")]
        public IActionResult DeleteCustomerDetail(int customerId)
        {
            if(customerId== null || customerId <= 0)
            {
                return BadRequest(new
                {
                    error = "customerId cannot be null or zero"
                });
            }

            var result = _customerDA.deleteCustomerDetail(customerId);
            if(result <=0)
            {
                return BadRequest(new
                {
                    error = "Customer detail Infos are not deleted."
                });
            }
            return Ok(new
            {
                success = "Customer Detail Infos are deleted successfully."
            });
        }
        
    }
}
