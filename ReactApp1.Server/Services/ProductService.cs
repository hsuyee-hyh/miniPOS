using ReactApp1.Server.Models;

namespace ReactApp1.Server.Services
{
    public class ProductService
    {
        public void checkCreateInput(ProductCreateRequestDto productRequestData)
        {
           

            if (string.IsNullOrWhiteSpace(productRequestData.ProductName) ||
                string.IsNullOrWhiteSpace(productRequestData.ProductDescription) ||
                productRequestData.BuyingPrice <= 0 ||
                productRequestData.SellingPrice <= 0 ||
                string.IsNullOrWhiteSpace(productRequestData.Category) ||

                string.IsNullOrWhiteSpace(productRequestData.Lvl1Unit) ||
                productRequestData.StockLvl1 <= 0 ||
                productRequestData.Lvl1SellingPrice <= 0 ||
                //string.IsNullOrWhiteSpace(product.ImgUrl) ||
                string.IsNullOrWhiteSpace(productRequestData.ProductOwner)
            )
            {
                throw new Exception("One or more required input fields are required.");
            }
        }

        public void checkProductId(int productId)
        {
            if(productId <= 0)
            {
                throw new Exception("ProductId cannot be null or zero.");
            }

        }
    }
}
