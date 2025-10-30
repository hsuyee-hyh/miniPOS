using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApp1.Server.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddLevel1andLevel2ColumnToProductTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Lvl1SellingPrice",
                table: "Products",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Lvl2SellingPrice",
                table: "Products",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Lvl3SellingPrice",
                table: "Products",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "lvl1Unit",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "lvl2Unit",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "lvl3Unit",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Lvl1SellingPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Lvl2SellingPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Lvl3SellingPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "lvl1Unit",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "lvl2Unit",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "lvl3Unit",
                table: "Products");
        }
    }
}
