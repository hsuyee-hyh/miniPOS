using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApp1.Server.Database
{
    public class AppDbContext : DbContext
    {
 
        public AppDbContext(DbContextOptions options):base(options)
        {

        }

        public DbSet<User> Users { get; set; }

        public DbSet<Product> Products { get; set; }

        public DbSet<Customer> Customers { get; set; }

        public DbSet<Order> Orders { get; set; }

        public DbSet<OrderItem> OrderItems { get; set; }

        public DbSet<Invoice> Invoices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Customer>()
                .HasIndex(u => u.CustomerCode)
                .IsUnique();

            // Customer -> Orders
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Customer)
                .WithMany(c => c.Orders)
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);

            // one order -> one OrderItem
            modelBuilder.Entity<Order>()
                .HasOne(o => o.OrderItem)
                .WithOne(oi => oi.Order)
                .HasForeignKey<OrderItem>(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // one invoice -> one OrderItem
            // invoice will not delete after deleting OrderItem
            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.OrderItem)
                .WithOne(oi => oi.Invoice)
                .HasForeignKey<Invoice>(i => i.OrderItemId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
