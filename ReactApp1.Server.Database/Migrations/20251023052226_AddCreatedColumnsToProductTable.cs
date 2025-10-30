using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApp1.Server.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatedColumnsToProductTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "lvl3Unit",
                table: "Products",
                newName: "Lvl3Unit");

            migrationBuilder.RenameColumn(
                name: "lvl2Unit",
                table: "Products",
                newName: "Lvl2Unit");

            migrationBuilder.RenameColumn(
                name: "lvl1Unit",
                table: "Products",
                newName: "Lvl1Unit");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedDate",
                table: "Products",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "Lvl3Unit",
                table: "Products",
                newName: "lvl3Unit");

            migrationBuilder.RenameColumn(
                name: "Lvl2Unit",
                table: "Products",
                newName: "lvl2Unit");

            migrationBuilder.RenameColumn(
                name: "Lvl1Unit",
                table: "Products",
                newName: "lvl1Unit");
        }
    }
}
