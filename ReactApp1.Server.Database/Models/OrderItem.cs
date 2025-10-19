using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApp1.Server.Database.Models
{
    public class OrderItem
    {
        [Key]
        public int Id { get; set; }

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
        public DateTimeOffset CreatedDate { get; set; }
        [Required]
        public string CreatedBy { get; set; }

        [Required]
        public bool IsGeneratedInvoice { get; set; }

        // fk
        [ForeignKey(nameof(OrderId))]
        public Order Order { get; set; }

        public Invoice Invoice { get; set; }


    }
}
