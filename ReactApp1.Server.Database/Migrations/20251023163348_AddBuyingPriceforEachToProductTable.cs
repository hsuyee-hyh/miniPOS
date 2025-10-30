using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApp1.Server.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddBuyingPriceforEachToProductTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "NumberOfUnit2",
                table: "Products",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<decimal>(
                name: "Lvl1BuyingPrice",
                table: "Products",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Lvl2BuyingPrice",
                table: "Products",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Lvl3BuyingPrice",
                table: "Products",
                type: "decimal(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Lvl1BuyingPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Lvl2BuyingPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Lvl3BuyingPrice",
                table: "Products");

            migrationBuilder.AlterColumn<int>(
                name: "NumberOfUnit2",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
