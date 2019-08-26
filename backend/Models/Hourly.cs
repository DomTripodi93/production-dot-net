using System;

namespace BackEnd.Models
{
    public class Hourly
    {
        public int Id { get; set; }
        public User User { get; set; }
        public int userId { get; set; }
        public string Machine { get; set; }
        public string Job { get; set; }
        public string Quantity { get; set; }
        public string CounterQuantity { get; set; }
        public DateTime Time { get; set; }
    }
}