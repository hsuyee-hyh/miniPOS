using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.DataAcess;
using ReactApp1.Server.Database;
using ReactApp1.Server.Database.Models;
using ReactApp1.Server.Models;
using ReactApp1.Server.ResponseModels;
using ReactApp1.Server.Services;
using System.ComponentModel;
using System.Data.Common;
using System.Threading.Tasks;

namespace ReactApp1.Server.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ProductService _productService;
        private readonly ProductDA _productDA;


        public ProductController(AppDbContext context, ProductService productService, ProductDA productDA)
        {
            _context = context;
            _productService = productService;
            _productDA = productDA;
        }


        [HttpGet("products")]
        public async Task<IActionResult> GetAllProducts()
        {
           List<Product> result =  await _context.Products.OrderByDescending(x => x.Id).ToListAsync();
            return Ok(result);
        }

        [HttpGet("{productId}")]
        public IActionResult GetProductDetail(int productId)
        {
            _productService.checkProductId(productId);
            ProductResponseModel foundProduct = _productDA.GetProductDetailAsync(productId);
            if(foundProduct.product == null)
            {
                return NotFound(new
                {
                    error = $"Product is not found with that id, {productId}"
                });
            }
            return Ok(new
            {
                success = "Product is found.",
                product = foundProduct,
            });
            
        }

        [HttpGet("{productId}/units")]
        public async Task<IActionResult> GetAllUnits(int productId)
        {
            _productService.checkProductId(productId);
            
            List<string> unitList =await _productDA.GetAllUnits(productId);
            if (unitList.Count < 0 || unitList is null)
            {
                return BadRequest(new
                {
                    error = "Units are not found."
                });
            }
            return Ok(new
            {
                success = "Units are found.",
                unitList = unitList.Distinct(),
            });
        }

        [HttpPost("edit/{productId}")]
        public async Task<IActionResult> EditProductById(int productId, [FromForm] ProductCreateRequestDto dto)
        {
            if(productId <= 0)
            {
                return BadRequest(new { message = "Product id cannot be null." });
            }
            var product = await _context.Products.FirstOrDefaultAsync(x => x.Id == productId);
            if(product is null)
            {
                return BadRequest(new { message = "Product cannot found." });
            }

            if (string.IsNullOrWhiteSpace(dto.ProductName) ||
               string.IsNullOrWhiteSpace(dto.ProductDescription) ||
               dto.BuyingPrice == 0 ||
               dto.SellingPrice == 0 ||
               string.IsNullOrWhiteSpace(dto.Category) ||
               //dto.stockLvl1 == 0 ||
               //string.IsNullOrWhiteSpace(product.ImgUrl) ||
               string.IsNullOrWhiteSpace(dto.ProductOwner)
           )
            {
                return BadRequest(new { message = "All fields cannot be null." });
            }

            product.ProductName = dto.ProductName;
            product.ProductDescription = dto.ProductDescription;
            product.BuyingPrice = dto.BuyingPrice;
            product.SellingPrice = dto.SellingPrice;
            product.Category = dto.Category;
            product.StockLvl1 = dto.StockLvl1;
            product.StockLvl2 = dto.StockLvl2;
            product.StockLvl3 = dto.StockLvl3;
            product.ProductOwner = dto.ProductOwner;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new {message = "Product is successfully updated."});
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating product", error = ex.Message });
            }
        
        }


        [HttpGet]
        public async Task<IActionResult> GetProductById([FromQuery] int productId)
        {
            if (productId <= 0)
            {
                return BadRequest(new { message = "Product id cannot be null." });
            }
            var product = await _context.Products.FirstOrDefaultAsync(x => x.Id == productId);
            if (product is null)
            {
                return BadRequest(new { message = "Product cannot found." });
            }

            return Ok(product);
        }

        [HttpPost("create-product")]
        public async Task<IActionResult> CreateProductAsync([FromForm] ProductCreateRequestDto productRequestData)
        {
            try
            {
                _productService.checkCreateInput(productRequestData);
                int result =await _productDA.createProductAsync(productRequestData);
                
                if (result == 0)
                {
                    return BadRequest(new { error = "Product already existed" });
                }

                if(result < 0) {
                    return BadRequest(new { error = "Product creation didn't success." });
                }
                else
                {
                    return Ok(new { success = "Product creation success." });
                }
                    

            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = ex.Message,
                });
            }
            
        }



        [HttpDelete("delete/{productId}")]
        public async Task<IActionResult> DeleteProduct(int productId)
        {
            if(productId == 0 || productId == null)
            {
                return BadRequest(new { message = "ProductId cannot be  null." });
            }

            var product = await _context.Products.FirstOrDefaultAsync(x => x.Id == productId);
            if(product == null)
            {
                return BadRequest(new { message = "Product cannot be null." });
            }

            try
            {
                _context.Remove(product);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Product deleted successfully." });
            }catch(Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting product.", error = ex.Message });
            }
        }
    }
}
