using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Database;
using ReactApp1.Server.Database.Models;
using ReactApp1.Server.Models;
using System.Threading.Tasks;

namespace ReactApp1.Server.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet("products")]
        public async Task<IActionResult> GetAllProducts()
        {
           List<Product> result =  await _context.Products.OrderByDescending(x => x.Id).ToListAsync();
            return Ok(result);
        }

        [HttpPost("edit/{productId}")]
        public async Task<IActionResult> EditProductById(int productId, [FromForm] ProductCreateDto dto)
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

            if (string.IsNullOrWhiteSpace(dto.productName) ||
               string.IsNullOrWhiteSpace(dto.productDescription) ||
               dto.buyingPrice == 0 ||
               dto.sellingPrice == 0 ||
               string.IsNullOrWhiteSpace(dto.category) ||
               //dto.stockLvl1 == 0 ||
               //string.IsNullOrWhiteSpace(product.ImgUrl) ||
               string.IsNullOrWhiteSpace(dto.productOwner)
           )
            {
                return BadRequest(new { message = "All fields cannot be null." });
            }

            product.ProductName = dto.productName;
            product.ProductDescription = dto.productDescription;
            product.BuyingPrice = dto.buyingPrice;
            product.SellingPrice = dto.sellingPrice;
            product.Category = dto.category;
            product.StockLvl1 = dto.stockLvl1;
            product.StockLvl2 = dto.stockLvl2;
            product.StockLvl3 = dto.stockLvl3;
            product.ProductOwner = dto.productOwner;

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
        public async Task<IActionResult> CreateProductAsync([FromForm] ProductCreateDto dto)
        {
            string? fileName = null;

            if (string.IsNullOrWhiteSpace(dto.productName) ||
                string.IsNullOrWhiteSpace(dto.productDescription) ||
                dto.buyingPrice == 0 ||
                dto.sellingPrice == 0 ||
                string.IsNullOrWhiteSpace(dto.category) ||
                dto.stockLvl1 == 0 ||
                //string.IsNullOrWhiteSpace(product.ImgUrl) ||
                string.IsNullOrWhiteSpace(dto.productOwner)
            )
            {
                return BadRequest(new { message = "All fields cannot be null." });
            }

            var existingProduct = await _context.Products.FirstOrDefaultAsync(x => x.ProductName == dto.productName);
            if (existingProduct != null)
            {
                return BadRequest(new { message = "Product is existed in list." });
            }

            if (dto.imgUrl != null && dto.imgUrl.Length > 0)
            {
                fileName = dto.imgUrl.FileName;

                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/productImages");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.imgUrl.CopyToAsync(stream);
                }
            }

            var newProduct = new Product
            {
                ProductName = dto.productName,
                ProductDescription = dto.productDescription,
                BuyingPrice = dto.buyingPrice,
                SellingPrice = dto.sellingPrice,
                Category = dto.category,
                StockLvl1 = dto.stockLvl1,
                StockLvl2 = dto.stockLvl2 ?? 0,
                StockLvl3 = dto.stockLvl3 ?? 0,
                ProductOwner = dto.productOwner,
                ImgUrl = fileName != null ? "/productImages/" + fileName : null
            };

            // insert 
            await _context.Products.AddAsync(newProduct);
            var result = await _context.SaveChangesAsync();
            if (result == 0)
            {
                return BadRequest(new { message = "Failed to create Product" });
            }
            return Ok(new { message = "Product creation success." });
           
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
