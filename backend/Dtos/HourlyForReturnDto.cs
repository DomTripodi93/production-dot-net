using System;

namespace BackEnd.Dtos
{
    public class HourlyForReturnDto
    {
        public int Id { get; set; }
        public string Machine { get; set; }
        public string JobNumber { get; set; }
        public string OpNumber { get; set; }
        public string Quantity { get; set; }
        public string CounterQuantity { get; set; }
        public string StartTime { get; set; }
        public string Time { get; set; }
        public DateTime Date { get; set; }
        
    }
}