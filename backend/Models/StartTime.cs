using System;

namespace BackEnd.Models
{
    public class StartTime
    {
        public int Id { get; set; }
        public User User { get; set; }
        public int userId { get; set; }
        public string Machine { get; set; }
        public DateTime Date { get; set; }
    }
}