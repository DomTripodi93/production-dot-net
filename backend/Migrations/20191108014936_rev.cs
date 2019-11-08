using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class rev : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Rev",
                table: "Parts",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rev",
                table: "Parts");
        }
    }
}
