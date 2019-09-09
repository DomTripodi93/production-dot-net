using System;

namespace BackEnd.Dtos
{
    public class HourlyForCreationDto
    {
        public string Machine { get; set; }
        public string JobNumber { get; set; }
        public string Operation { get; set; }
        public string Quantity { get; set; }
        public string CounterQuantity { get; set; }
        public DateTime Time { get; set; }
        
    }
}