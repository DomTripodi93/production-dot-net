using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options): base (options) {}
        public DbSet<User> Users { get; set; }
        public DbSet<Settings> Settings { get; set; }
        public DbSet<ChangeLog> ChangeLogs { get; set; }
        public DbSet<Mach> Machines { get; set; }
        public DbSet<Part> Parts { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Operation> Operations { get; set; }
        public DbSet<Hourly> Hourlys { get; set; }
        public DbSet<Production> Production { get; set; }
        public DbSet<StartTime> StartTimes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Mach>()
                .HasKey(m => new {m.userId, m.Machine});
            modelBuilder.Entity<Part>()
                .HasKey(p => new {p.userId, p.PartNumber});
            modelBuilder.Entity<Job>()
                .HasKey(j => new {j.userId, j.JobNumber});
            modelBuilder.Entity<Settings>()
                .HasKey(s => s.userId);
        }
    }
}