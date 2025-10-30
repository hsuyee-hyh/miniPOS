using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Database;
using ReactApp1.Server.Database.Models;
using ReactApp1.Server.Models;
using System.Threading.Tasks;

namespace ReactApp1.Server.DataAcess
{
    public class ProductDA
    {
        private readonly AppDbContext _context;

        public ProductDA(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<string>> GetAllUnits(int productId)
        {
            var product =await _context.Products
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product is null)
            {
                return null;
            }

            var units = new List<string>();
            if (!string.IsNullOrEmpty(product.Lvl1Unit))
            {
                units.Add(product.Lvl1Unit);
            }
            if (!string.IsNullOrEmpty(product.Lvl2Unit))
            {
                units.Add(product.Lvl2Unit);
            }
            if (!string.IsNullOrEmpty(product.Lvl3Unit))
            {
                units.Add(product.Lvl3Unit);
            }

            return units;
        }
        public async Task<int> createProductAsync(ProductCreateRequestDto productRequestData)
        {
            string? fileName = null;


            var existingProduct = await _context.Products.FirstOrDefaultAsync(x => x.ProductName == productRequestData.ProductName);
            if (existingProduct != null)
            {
                return 0;
            }

            if (productRequestData.ImgUrl != null && productRequestData.ImgUrl.Length > 0)
            {
                // get file name
                fileName = productRequestData.ImgUrl.FileName;

                // define directory
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/productImages");

                // check directory exists or not
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                // combine file directory and fileName (to create filepath)
                var filePath = Path.Combine(folderPath, fileName);

                // create FileStream and add into that file path
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await productRequestData.ImgUrl.CopyToAsync(stream);
                }
            }

            var newProduct = new Product
            {
                ProductName = productRequestData.ProductName,
                ProductDescription = productRequestData.ProductDescription,
                BuyingPrice = productRequestData.BuyingPrice,
                SellingPrice = productRequestData.SellingPrice,
                Category = productRequestData.Category,

                Lvl1Unit = productRequestData.Lvl1Unit,
                StockLvl1 = productRequestData.StockLvl1,
                Lvl1SellingPrice = productRequestData.Lvl1SellingPrice,

                NumberOfUnit2 = productRequestData.NumberOfUnit2 ?? -1,

                Lvl2Unit = productRequestData.Lvl2Unit ?? "",
                StockLvl2 = productRequestData.StockLvl2 ?? -1,
                Lvl2SellingPrice = productRequestData.Lvl2SellingPrice ?? 0,

                NumberOfUnit3 = productRequestData.NumberOfUnit3 ?? -1,

                Lvl3Unit = productRequestData.Lvl3Unit ?? "",
                StockLvl3 = productRequestData.StockLvl3 ?? -1,
                Lvl3SellingPrice = productRequestData.Lvl3SellingPrice ?? 0,

                ProductOwner = productRequestData.ProductOwner,
                ImgUrl = fileName != null ? "/productImages/" + fileName : null,

                CreatedDate = DateTime.UtcNow,
                CreatedBy = "Admin",
            };

            // insert 
            await _context.Products.AddAsync(newProduct);
            var result = await _context.SaveChangesAsync();
            return result;
        }
    }
}
