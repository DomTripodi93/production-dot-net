using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options): base (options) {}
        public DbSet<User> Users { get; set; }
        public DbSet<Mach> Machines { get; set; }
        public DbSet<Part> Parts { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Hourly> Hourlys { get; set; }
        public DbSet<Production> Production { get; set; }
        public DbSet<StartTime> StartTimes { get; set; }
        public DbSet<Settings> Settings { get; set; }
        public DbSet<ChangeLog> ChangeLogs { get; set; }
    }
}