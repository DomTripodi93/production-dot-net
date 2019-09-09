using System;
using BackEnd.Models;

namespace BackEnd.Models
{
    public class Hourly
    {
        public int Id { get; set; }
        public User User { get; set; }
        public int userId { get; set; }
        public Job Job { get; set; }
        public string Operation { get; set; }
        public string JobNumber { get; set; }
        public string Machine { get; set; }
        public string Quantity { get; set; }
        public string CounterQuantity { get; set; }
        public DateTime Time { get; set; }
    }
}