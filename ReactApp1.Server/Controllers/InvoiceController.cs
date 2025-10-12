using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.DataAcess;
using ReactApp1.Server.Database.Models;
using ReactApp1.Server.RequestModels;
using ReactApp1.Server.ResponseModels;
using ReactApp1.Server.Services;
using System.Threading.Tasks;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly InvoiceService _invoiceService;
        private readonly InvoiceDA _invoiceDA;
        public InvoiceController(InvoiceService invoiceService, InvoiceDA invoiceDA)
        {
            _invoiceService = invoiceService;
            _invoiceDA = invoiceDA;
        }


        [HttpPost("create-invoice")]
        public async Task<IActionResult> createInvoice([FromBody] InvoiceDto invoiceRequestDto)
        {
            try
            {
                _invoiceService.checkInvoiceData(invoiceRequestDto);

                InvoiceResponseModel invoiceResponseModel = await _invoiceDA.createInvoiceAsync(invoiceRequestDto);
                
                if(invoiceResponseModel.IsNew == false)
                {
                    return Ok(new
                    {
                        success = "Invoice already existed.",
                        foundInvoice = invoiceResponseModel.InvoiceData, 
                        isNew = false,
                    });
                }

                return Ok(new { 
                    success = $"Invoice data is created successfully",
                    createdInvoice = invoiceResponseModel.InvoiceData,
                    isNew = true,
                });

            }catch (Exception ex)
            {
                return BadRequest(new {error = ex.Message});
            }
        }
    }
}
