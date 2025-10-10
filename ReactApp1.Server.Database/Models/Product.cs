using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApp1.Server.Database.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string ProductName { get; set; } = string.Empty;
        [Required]
        public string ProductDescription { get; set; } = string.Empty;
        [Required]
        public decimal BuyingPrice { get; set; }
        [Required]
        public decimal SellingPrice { get; set; }
        [Required]
        public string Category { get; set; } = string.Empty;
        [Required]
        public int StockLvl1 { get; set; }
        public int? StockLvl2 { get; set; }
        public int? StockLvl3 { get; set; }
        public string? ImgUrl { get; set; }
        [Required]
        public string ProductOwner { get; set; } = string.Empty;

    }
}
