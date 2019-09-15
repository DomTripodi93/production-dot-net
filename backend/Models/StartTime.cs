using System;

namespace BackEnd.Models
{
    public class StartTime
    {
        public int Id { get; set; }
        public User User { get; set; }
        public int userId { get; set; }
        public string Machine { get; set; }
        public Mach Mach { get; set; }
        public string Shift { get; set; }
        public DateTime Date { get; set; }
    }
}