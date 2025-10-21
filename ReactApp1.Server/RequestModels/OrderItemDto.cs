using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.Models
{
    public class OrderItemDto
    {
        [Required]
        public int OrderId { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public string Product { get; set; }

        [Required]
        public decimal TotalSellingCost { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public decimal Balance { get; set; }

        [Required]
        public int CustomerId { get; set; }

        [Required]
        public bool IsGeneratedInvoice { get; set; }

    }
}
