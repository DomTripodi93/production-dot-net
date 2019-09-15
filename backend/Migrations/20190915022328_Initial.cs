using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class Initial : Migration
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
                name: "Machines",
                columns: table => new
                {
                    userId = table.Column<int>(nullable: false),
                    Machine = table.Column<string>(nullable: false),
                    CurrentJob = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Machines", x => new { x.userId, x.Machine });
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
                    userId = table.Column<int>(nullable: false),
                    PartNumber = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Parts", x => new { x.userId, x.PartNumber });
                    table.ForeignKey(
                        name: "FK_Parts_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Settings",
                columns: table => new
                {
                    userId = table.Column<int>(nullable: false),
                    IsNew = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Settings", x => x.userId);
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
                    Shift = table.Column<string>(nullable: true),
                    Date = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StartTimes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StartTimes_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StartTimes_Machines_userId_Machine",
                        columns: x => new { x.userId, x.Machine },
                        principalTable: "Machines",
                        principalColumns: new[] { "userId", "Machine" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Jobs",
                columns: table => new
                {
                    userId = table.Column<int>(nullable: false),
                    JobNumber = table.Column<string>(nullable: false),
                    PartuserId = table.Column<int>(nullable: true),
                    PartNumber = table.Column<string>(nullable: true),
                    partId = table.Column<int>(nullable: false),
                    PartNum = table.Column<string>(nullable: true),
                    OrderQuantity = table.Column<string>(nullable: true),
                    PossibleQuantity = table.Column<string>(nullable: true),
                    RemainingQuantity = table.Column<string>(nullable: true),
                    MatRecieved = table.Column<string>(nullable: true),
                    WeightQuantity = table.Column<string>(nullable: true),
                    WeightLength = table.Column<string>(nullable: true),
                    WeightRecieved = table.Column<string>(nullable: true),
                    Oal = table.Column<string>(nullable: true),
                    CutOff = table.Column<string>(nullable: true),
                    MainFacing = table.Column<string>(nullable: true),
                    SubFacing = table.Column<string>(nullable: true),
                    HeatLot = table.Column<string>(nullable: true),
                    Bars = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Jobs", x => new { x.userId, x.JobNumber });
                    table.ForeignKey(
                        name: "FK_Jobs_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Jobs_Parts_PartuserId_PartNumber",
                        columns: x => new { x.PartuserId, x.PartNumber },
                        principalTable: "Parts",
                        principalColumns: new[] { "userId", "PartNumber" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Operations",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    userId = table.Column<int>(nullable: false),
                    JobId = table.Column<int>(nullable: false),
                    JobNumber = table.Column<string>(nullable: true),
                    Op = table.Column<string>(nullable: true),
                    Machine = table.Column<string>(nullable: true),
                    RemainingQuantity = table.Column<string>(nullable: true),
                    CycleTime = table.Column<string>(nullable: true),
                    PartsToDate = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Operations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Operations_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Operations_Jobs_userId_JobNumber",
                        columns: x => new { x.userId, x.JobNumber },
                        principalTable: "Jobs",
                        principalColumns: new[] { "userId", "JobNumber" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Hourlys",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    userId = table.Column<int>(nullable: false),
                    OperationId = table.Column<int>(nullable: true),
                    OpId = table.Column<int>(nullable: false),
                    OpNumber = table.Column<string>(nullable: true),
                    JobNumber = table.Column<string>(nullable: true),
                    Machine = table.Column<string>(nullable: true),
                    Quantity = table.Column<string>(nullable: true),
                    CounterQuantity = table.Column<string>(nullable: true),
                    Time = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hourlys", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Hourlys_Operations_OperationId",
                        column: x => x.OperationId,
                        principalTable: "Operations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Hourlys_Users_userId",
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
                    OperationId = table.Column<int>(nullable: true),
                    OpId = table.Column<int>(nullable: false),
                    OpNumber = table.Column<string>(nullable: true),
                    JobNumber = table.Column<string>(nullable: true),
                    PartNumber = table.Column<string>(nullable: true),
                    Machine = table.Column<string>(nullable: true),
                    Shift = table.Column<string>(nullable: true),
                    Quantity = table.Column<string>(nullable: true),
                    Date = table.Column<DateTime>(nullable: false),
                    InQuestion = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Production", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Production_Operations_OperationId",
                        column: x => x.OperationId,
                        principalTable: "Operations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Production_Users_userId",
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
                name: "IX_Hourlys_OperationId",
                table: "Hourlys",
                column: "OperationId");

            migrationBuilder.CreateIndex(
                name: "IX_Hourlys_userId",
                table: "Hourlys",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_Jobs_PartuserId_PartNumber",
                table: "Jobs",
                columns: new[] { "PartuserId", "PartNumber" });

            migrationBuilder.CreateIndex(
                name: "IX_Operations_userId_JobNumber",
                table: "Operations",
                columns: new[] { "userId", "JobNumber" });

            migrationBuilder.CreateIndex(
                name: "IX_Production_OperationId",
                table: "Production",
                column: "OperationId");

            migrationBuilder.CreateIndex(
                name: "IX_Production_userId",
                table: "Production",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_StartTimes_userId_Machine",
                table: "StartTimes",
                columns: new[] { "userId", "Machine" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChangeLogs");

            migrationBuilder.DropTable(
                name: "Hourlys");

            migrationBuilder.DropTable(
                name: "Production");

            migrationBuilder.DropTable(
                name: "Settings");

            migrationBuilder.DropTable(
                name: "StartTimes");

            migrationBuilder.DropTable(
                name: "Operations");

            migrationBuilder.DropTable(
                name: "Machines");

            migrationBuilder.DropTable(
                name: "Jobs");

            migrationBuilder.DropTable(
                name: "Parts");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
