using System;
using BackEnd.Models;

namespace BackEnd.Models
{
    public class Production
    {
        public int Id { get; set; }
        public User User { get; set; }
        public int userId { get; set; }
        public Job Job { get; set; }
        public int JobId { get; set; }
        public string JobNumber { get; set; }
        public string Operation { get; set; }
        public string PartNumber { get; set; }
        public string Machine { get; set; }
        public string Shift { get; set; }
        public string Quantity { get; set; }
        public DateTime Date { get; set; }
        public bool InQuestion { get; set; }
    }
}