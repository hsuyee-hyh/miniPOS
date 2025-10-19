using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApp1.Server.Database.Migrations
{
    /// <inheritdoc />
    public partial class ChangeNullableFKOrderItemIdinInvoiceTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Invoices_OrderItemId",
                table: "Invoices");

            migrationBuilder.AlterColumn<int>(
                name: "OrderItemId",
                table: "Invoices",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_OrderItemId",
                table: "Invoices",
                column: "OrderItemId",
                unique: true,
                filter: "[OrderItemId] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Invoices_OrderItemId",
                table: "Invoices");

            migrationBuilder.AlterColumn<int>(
                name: "OrderItemId",
                table: "Invoices",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_OrderItemId",
                table: "Invoices",
                column: "OrderItemId",
                unique: true);
        }
    }
}
