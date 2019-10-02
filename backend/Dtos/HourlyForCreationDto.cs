using System;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Dtos
{
    public class HourlyForCreationDto
    {        
        [Required]
        public string Machine { get; set; }

        [Required]
        public string JobNumber { get; set; }
        
        [Required]
        public string OpNumber { get; set; }
        public string Quantity { get; set; }
        public string CounterQuantity { get; set; }
        
        [Required]
        public string Time { get; set; }
        
        [Required]
        public DateTime Date { get; set; }
        public string StartTime { get; set; }        
    }
}