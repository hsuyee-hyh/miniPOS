using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApp1.Server.Database.Models
{
    public class Invoice
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string InvoiceId { get; set; }

        [Required]
        public decimal TotalBalance { get; set; }

        [Required]
        public decimal PaidAmount { get; set; }

        [Required]
        public decimal RemainingBalance { get; set; }

        [Required]
        public DateTimeOffset CreatedDate { get; set; }

        [Required]
        public string CreatedBy { get; set; }

        [Required]
        public int CustomerId { get; set; }

      
        public int? OrderItemId { get; set; }

        [ForeignKey(nameof(OrderItemId))]
        public OrderItem OrderItem { get; set; }

        [ForeignKey(nameof(CustomerId))]
        public Customer Customer { get; set; }
    }
}
