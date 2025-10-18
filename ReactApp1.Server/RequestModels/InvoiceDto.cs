using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.RequestModels
{
    public class InvoiceDto
    {

        [Required]
        public decimal TotalBalance { get; set; }

        [Required]
        public decimal PaidAmount { get; set; }

        [Required]
        public decimal RemainingBalance { get; set; }

        [Required]
        public int CustomerId { get; set; }
    }
}
