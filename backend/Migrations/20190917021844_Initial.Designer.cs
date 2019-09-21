﻿// <auto-generated />
using System;
using BackEnd.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace backend.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20190917021844_Initial")]
    partial class Initial
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079");

            modelBuilder.Entity("BackEnd.Models.ChangeLog", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ChangeType");

                    b.Property<string>("ChangedId");

                    b.Property<string>("ChangedModel");

                    b.Property<string>("OldValues");

                    b.Property<DateTime>("TimeStamp");

                    b.Property<int>("userId");

                    b.HasKey("Id");

                    b.HasIndex("userId");

                    b.ToTable("ChangeLogs");
                });

            modelBuilder.Entity("BackEnd.Models.Hourly", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("CounterQuantity");

                    b.Property<DateTime>("Date");

                    b.Property<string>("JobNumber");

                    b.Property<string>("Machine");

                    b.Property<int>("OpId");

                    b.Property<string>("OpNumber");

                    b.Property<string>("Quantity");

                    b.Property<string>("Time");

                    b.Property<int>("userId");

                    b.HasKey("Id");

                    b.HasIndex("userId", "JobNumber", "OpNumber");

                    b.ToTable("Hourlys");
                });

            modelBuilder.Entity("BackEnd.Models.Job", b =>
                {
                    b.Property<int>("userId");

                    b.Property<string>("JobNumber");

                    b.Property<string>("Bars");

                    b.Property<string>("CutOff");

                    b.Property<string>("HeatLot");

                    b.Property<string>("MainFacing");

                    b.Property<string>("MatRecieved");

                    b.Property<string>("Oal");

                    b.Property<string>("OrderQuantity");

                    b.Property<string>("PartNum");

                    b.Property<string>("PartNumber");

                    b.Property<int?>("PartuserId");

                    b.Property<string>("PossibleQuantity");

                    b.Property<string>("RemainingQuantity");

                    b.Property<string>("SubFacing");

                    b.Property<string>("WeightLength");

                    b.Property<string>("WeightQuantity");

                    b.Property<string>("WeightRecieved");

                    b.HasKey("userId", "JobNumber");

                    b.HasIndex("PartuserId", "PartNumber");

                    b.ToTable("Jobs");
                });

            modelBuilder.Entity("BackEnd.Models.Mach", b =>
                {
                    b.Property<int>("userId");

                    b.Property<string>("Machine");

                    b.Property<string>("CurrentJob");

                    b.Property<string>("CurrentOp");

                    b.HasKey("userId", "Machine");

                    b.ToTable("Machines");
                });

            modelBuilder.Entity("BackEnd.Models.Operation", b =>
                {
                    b.Property<int>("userId");

                    b.Property<string>("JobNumber");

                    b.Property<string>("OpNumber");

                    b.Property<string>("CycleTime");

                    b.Property<string>("Machine");

                    b.Property<string>("PartsToDate");

                    b.Property<string>("RemainingQuantity");

                    b.HasKey("userId", "JobNumber", "OpNumber");

                    b.ToTable("Operations");
                });

            modelBuilder.Entity("BackEnd.Models.Part", b =>
                {
                    b.Property<int>("userId");

                    b.Property<string>("PartNumber");

                    b.HasKey("userId", "PartNumber");

                    b.ToTable("Parts");
                });

            modelBuilder.Entity("BackEnd.Models.Production", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("Date");

                    b.Property<bool>("InQuestion");

                    b.Property<string>("JobNumber");

                    b.Property<string>("Machine");

                    b.Property<string>("OpNumber");

                    b.Property<string>("PartNumber");

                    b.Property<string>("Quantity");

                    b.Property<string>("Shift");

                    b.Property<int>("userId");

                    b.HasKey("Id");

                    b.HasIndex("userId", "JobNumber", "OpNumber");

                    b.ToTable("Production");
                });

            modelBuilder.Entity("BackEnd.Models.Settings", b =>
                {
                    b.Property<int>("userId");

                    b.Property<bool>("IsNew");

                    b.HasKey("userId");

                    b.ToTable("Settings");
                });

            modelBuilder.Entity("BackEnd.Models.StartTime", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("Date");

                    b.Property<string>("Machine");

                    b.Property<string>("Shift");

                    b.Property<int>("userId");

                    b.HasKey("Id");

                    b.HasIndex("userId", "Machine");

                    b.ToTable("StartTimes");
                });

            modelBuilder.Entity("BackEnd.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Email");

                    b.Property<string>("Name");

                    b.Property<byte[]>("PasswordHash");

                    b.Property<byte[]>("PasswordSalt");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("BackEnd.Models.ChangeLog", b =>
                {
                    b.HasOne("BackEnd.Models.User", "User")
                        .WithMany("ChangeLog")
                        .HasForeignKey("userId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("BackEnd.Models.Hourly", b =>
                {
                    b.HasOne("BackEnd.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("userId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("BackEnd.Models.Operation", "Operation")
                        .WithMany("Hourly")
                        .HasForeignKey("userId", "JobNumber", "OpNumber");
                });

            modelBuilder.Entity("BackEnd.Models.Job", b =>
                {
                    b.HasOne("BackEnd.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("userId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("BackEnd.Models.Part", "Part")
                        .WithMany("Jobs")
                        .HasForeignKey("PartuserId", "PartNumber");
                });

            modelBuilder.Entity("BackEnd.Models.Mach", b =>
                {
                    b.HasOne("BackEnd.Models.User", "User")
                        .WithMany("Machine")
                        .HasForeignKey("userId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("BackEnd.Models.Operation", b =>
                {
                    b.HasOne("BackEnd.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("userId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("BackEnd.Models.Job", "Job")
                        .WithMany("Operation")
                        .HasForeignKey("userId", "JobNumber")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("BackEnd.Models.Part", b =>
                {
                    b.HasOne("BackEnd.Models.User", "User")
                        .WithMany("Part")
                        .HasForeignKey("userId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("BackEnd.Models.Production", b =>
                {
                    b.HasOne("BackEnd.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("userId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("BackEnd.Models.Operation", "Operation")
                        .WithMany("Production")
                        .HasForeignKey("userId", "JobNumber", "OpNumber");
                });

            modelBuilder.Entity("BackEnd.Models.Settings", b =>
                {
                    b.HasOne("BackEnd.Models.User", "User")
                        .WithOne("Settings")
                        .HasForeignKey("BackEnd.Models.Settings", "userId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("BackEnd.Models.StartTime", b =>
                {
                    b.HasOne("BackEnd.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("userId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("BackEnd.Models.Mach", "Mach")
                        .WithMany("StartTimes")
                        .HasForeignKey("userId", "Machine");
                });
#pragma warning restore 612, 618
        }
    }
}