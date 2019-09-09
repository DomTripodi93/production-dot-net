using System;

namespace BackEnd.Models
{
    public class StartTime
    {
        public int Id { get; set; }
        public User User { get; set; }
        public int userId { get; set; }
        public int MachId { get; set; }
        public Mach Machine { get; set; }
        public string Shift { get; set; }
        public DateTime Date { get; set; }
    }
}