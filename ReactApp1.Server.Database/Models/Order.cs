using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApp1.Server.Database.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Product {  get; set; }
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
        public DateTimeOffset CreatedDate { get; set; }
        [Required]
        public string CreatedBy { get; set; }
        [Required]
        public int CustomerId { get; set; }

        [Required]
        public bool IsGeneratedInvoice { get; set; }

        // for fk
        public Customer Customer { get; set; }
        public OrderItem OrderItem { get; set; }

    }
}
