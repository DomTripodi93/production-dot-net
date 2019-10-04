using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class settingsChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DefaultBarCut",
                table: "Settings",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DefaultBarEnd",
                table: "Settings",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DefaultStartTime",
                table: "Settings",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DefaultBarCut",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "DefaultBarEnd",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "DefaultStartTime",
                table: "Settings");
        }
    }
}
