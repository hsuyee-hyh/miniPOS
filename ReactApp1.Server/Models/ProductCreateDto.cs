namespace ReactApp1.Server.Models
{
    public class ProductCreateDto
    {

        public string productName { get; set; }
        public string productDescription { get; set; }
        public decimal buyingPrice { get; set; }
        public decimal sellingPrice { get; set; }
        public string category { get; set; }
        public int stockLvl1 { get; set; }
        public int? stockLvl2 { get; set; }
        public int? stockLvl3 { get; set; }
        public IFormFile? imgUrl {  get; set; }

        public string productOwner { get; set; }
    }
}
