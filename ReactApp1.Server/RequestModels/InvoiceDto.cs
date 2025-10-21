using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.RequestModels
{
    public class InvoiceDto
    {
        [Required]
        public string InvoiceId { get; set; }

        [Required]
        public decimal TotalBalance { get; set; }

        [Required]
        public decimal PaidAmount { get; set; }

        [Required]
        public decimal RemainingBalance { get; set; }

        public DateTimeOffset? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }

        [Required]
        public int CustomerId { get; set; }

        public int? OrderItemId { get; set; }

        public string? CustomerName { get; set; }
    }
}
