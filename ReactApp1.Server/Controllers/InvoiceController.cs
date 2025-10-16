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

        [HttpGet("{invoiceId}")]
        public async Task<IActionResult> getInvoiceByInvoiceId (string invoiceId)
        {
            try
            {
                if (invoiceId is null)
                {
                    throw new Exception("InvoiceId cannot be null.");
                }
                var invoiceList =await _invoiceDA.getInvoiceByInvoiceIdAsync(invoiceId);

                if(invoiceList.InvoiceDataList is null || invoiceList.InvoiceDataList.Count <= 0)
                {
                    return NotFound(new
                    {
                        error = "Invoice not found."
                    });
                }
                return Ok(new
                {
                    success = "Invoice found!",
                    invoiceList = invoiceList
                });

            }catch(Exception ex)
            {
                return BadRequest(new {error = ex.Message});
            }
        }


        [HttpPost("create-invoice")]
        public async Task<IActionResult> createInvoice([FromBody] List<InvoiceDto> invoiceRequestDto)
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

        [HttpPut("update-invoice")]
        public async Task<IActionResult> updateInvoice([FromBody] InvoiceUpdateDto invoiceRequestDto)
        {
            try
            {
                _invoiceService.checkInvoiceUpdateData(invoiceRequestDto);

                InvoiceResponseModel response = await _invoiceDA.updateInvoiceAsync(invoiceRequestDto);
                if(response.InvoiceDataList is null || response.InvoiceDataList.Count <= 0)
                {
                    return NotFound(new {error = $"Invoice not found with that id: {invoiceRequestDto.Id}" });
                }
                return Ok(new { 
                    success = $"Invoice data is updated successfully.",
                    updatedInvoice = response.InvoiceData,
                });
            }catch(Exception ex)
            {
                return BadRequest(new { error = ex.Message});
            }
        }
    }
}
