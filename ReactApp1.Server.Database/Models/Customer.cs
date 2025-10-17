using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApp1.Server.Database.Models
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string CustomerCode { get; set; }

        [Required]
        public string CustomerName { get; set; }

        [Required]
        public string CustomerPhone { get; set; }

        [Required]
        public string CustomerAddress { get; set; }


        // orders
        public ICollection<Order> Orders { get; set; } = new List<Order>();

    }
}
