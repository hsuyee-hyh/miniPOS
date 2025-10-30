using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApp1.Server.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddUnitLevelColumnToOrderTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UnitLevel",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UnitLevel",
                table: "Orders");
        }
    }
}
