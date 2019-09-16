using System;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Dtos
{
    public class HourlyForCreationDto
    {        
        [Required]
        public string Machine { get; set; }
        public string JobNumber { get; set; }
        
        [Required]
        public int OpId { get; set; }
        public string Operation { get; set; }
        
        [Required]
        public string Quantity { get; set; }
        public string CounterQuantity { get; set; }
        
        [Required]
        public string Time { get; set; }
        
        [Required]
        public DateTime Date { get; set; }
        
    }
}