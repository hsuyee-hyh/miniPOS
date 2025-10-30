using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.Models
{
    public class OrderDto
    {
        [Required]
        public string Product { get; set; }
        [Required]
        public decimal SellingPrice { get; set; }
        [Required]
        public int ProductId { get; set; }

        public decimal AdditionalSellingPrice { get; set; }
        [Required]
        public decimal LabourCost { get; set; }
        [Required]
        public decimal VehicleCost { get; set; }
        [Required]
        public decimal TotalSellingCost { get; set; }
        [Required]
        public int Quantity { get; set; }

        [Required]
        public string UnitLevel { get; set; }

        [Required]
        public int CustomerId { get; set; }

        [Required]
        public bool IsGeneratedInvoice { get; set; }

    }
}
