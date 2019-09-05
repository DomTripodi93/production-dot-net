using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Email = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    PasswordHash = table.Column<byte[]>(nullable: true),
                    PasswordSalt = table.Column<byte[]>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Values",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Values", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ChangeLogs",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    userId = table.Column<int>(nullable: false),
                    ChangedModel = table.Column<string>(nullable: true),
                    ChangeType = table.Column<string>(nullable: true),
                    ChangedId = table.Column<string>(nullable: true),
                    OldValues = table.Column<string>(nullable: true),
                    TimeStamp = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChangeLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChangeLogs_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Hourlys",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    userId = table.Column<int>(nullable: false),
                    Machine = table.Column<string>(nullable: true),
                    Job = table.Column<string>(nullable: true),
                    Quantity = table.Column<string>(nullable: true),
                    CounterQuantity = table.Column<string>(nullable: true),
                    Time = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hourlys", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Hourlys_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Machines",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    userId = table.Column<int>(nullable: false),
                    Machine = table.Column<string>(nullable: true),
                    CurrentJob = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Machines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Machines_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Parts",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    userId = table.Column<int>(nullable: false),
                    PartNumber = table.Column<string>(nullable: true),
                    Machine = table.Column<string>(nullable: true),
                    Job = table.Column<string>(nullable: true),
                    OrderQuantity = table.Column<string>(nullable: true),
                    PossibleQuantity = table.Column<string>(nullable: true),
                    RemainingQuantity = table.Column<string>(nullable: true),
                    WeightQuantity = table.Column<string>(nullable: true),
                    WeightLength = table.Column<string>(nullable: true),
                    WeightRecieved = table.Column<string>(nullable: true),
                    Oal = table.Column<string>(nullable: true),
                    CutOff = table.Column<string>(nullable: true),
                    MainFacing = table.Column<string>(nullable: true),
                    SubFacing = table.Column<string>(nullable: true),
                    HeatLot = table.Column<string>(nullable: true),
                    CycleTime = table.Column<string>(nullable: true),
                    Bars = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Parts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Parts_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Production",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    userId = table.Column<int>(nullable: false),
                    PartNumber = table.Column<string>(nullable: true),
                    Machine = table.Column<string>(nullable: true),
                    Job = table.Column<string>(nullable: true),
                    Shift = table.Column<string>(nullable: true),
                    Quantity = table.Column<string>(nullable: true),
                    Date = table.Column<DateTime>(nullable: false),
                    InQuestion = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Production", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Production_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Settings",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    userId = table.Column<int>(nullable: false),
                    IsNew = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Settings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Settings_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StartTimes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    userId = table.Column<int>(nullable: false),
                    Machine = table.Column<string>(nullable: true),
                    Date = table.Column<DateTime>(nullable: false),
                    MachId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StartTimes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StartTimes_Machines_MachId",
                        column: x => x.MachId,
                        principalTable: "Machines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StartTimes_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChangeLogs_userId",
                table: "ChangeLogs",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_Hourlys_userId",
                table: "Hourlys",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_Machines_userId",
                table: "Machines",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_Parts_userId",
                table: "Parts",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_Production_userId",
                table: "Production",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_Settings_userId",
                table: "Settings",
                column: "userId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StartTimes_MachId",
                table: "StartTimes",
                column: "MachId");

            migrationBuilder.CreateIndex(
                name: "IX_StartTimes_userId",
                table: "StartTimes",
                column: "userId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChangeLogs");

            migrationBuilder.DropTable(
                name: "Hourlys");

            migrationBuilder.DropTable(
                name: "Parts");

            migrationBuilder.DropTable(
                name: "Production");

            migrationBuilder.DropTable(
                name: "Settings");

            migrationBuilder.DropTable(
                name: "StartTimes");

            migrationBuilder.DropTable(
                name: "Values");

            migrationBuilder.DropTable(
                name: "Machines");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
