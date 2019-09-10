using System;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Dtos
{
    public class ProdForCreationDto
    {
        public string PartNumber { get; set; }
        public string Machine { get; set; }
        public string JobNumber { get; set; }
        
        [Required]
        public int JobId { get; set; }
        public string Operation { get; set; }
        public string Shift { get; set; }
        
        [Required]
        public string Quantity { get; set; }
        
        [Required]
        public DateTime Date { get; set; }
        public bool InQuestion { get; set; }
        
    }
}