using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class skip : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "SkipLathe",
                table: "Settings",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SkipMill",
                table: "Settings",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SkipLathe",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "SkipMill",
                table: "Settings");
        }
    }
}
