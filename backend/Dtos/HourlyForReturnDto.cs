using System;

namespace BackEnd.Dtos
{
    public class HourlyForReturnDto
    {
        public int Id { get; set; }
        public string Machine { get; set; }
        public string JobNumber { get; set; }
        public int OpId { get; set; }
        public string Operation { get; set; }
        public string Quantity { get; set; }
        public string CounterQuantity { get; set; }
        public DateTime Time { get; set; }
        
    }
}