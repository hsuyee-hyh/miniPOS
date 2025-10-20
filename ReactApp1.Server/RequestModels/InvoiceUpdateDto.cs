using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.RequestModels
{
    public class InvoiceUpdateDto
    {

        public int? Id { get; set; }

        [Required]
        public string InvoiceId { get; set; }

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
