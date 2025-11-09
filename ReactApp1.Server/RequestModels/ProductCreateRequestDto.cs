using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.Models
{
    public class ProductCreateRequestDto
    {

        [Required]
        public string ProductName { get; set; }
        [Required]
        public string ProductDescription { get; set; }
        [Required]
        public decimal BuyingPrice { get; set; }
        [Required]
        public decimal SellingPrice { get; set; }
        [Required]
        public string Category { get; set; }

       
        public string? Lvl1Unit { get; set; }
        [Required]
        public int StockLvl1 { get; set; }
        [Required]
        public decimal Lvl1BuyingPrice { get; set; }
        [Required]
        public decimal Lvl1SellingPrice { get; set; }

        public int? NumberOfUnit2 { get; set; }


        public string? Lvl2Unit { get; set; }
        public int? StockLvl2 { get; set; }
        public decimal? Lvl2BuyingPrice { get; set; }
        public int? Lvl2SellingPrice { get; set; }
        


        public int? NumberOfUnit3 { get; set; }


        public string? Lvl3Unit { get; set; }
        public int? StockLvl3 { get; set; }
        public decimal? Lvl3BuyingPrice { get; set; }
        public int? Lvl3SellingPrice { get; set; }
        


        public IFormFile? ImgUrl {  get; set; }

        [Required]
        public string ProductOwner { get; set; }


    }
}
