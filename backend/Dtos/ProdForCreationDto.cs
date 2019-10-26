using System;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Dtos
{
    public class ProdForCreationDto
    {
        public string PartNumber { get; set; }
        public string Machine { get; set; }
        public string JobNumber { get; set; }
        public string OpNumber { get; set; }
        public string Shift { get; set; }
        
        [Required]
        public string Quantity { get; set; }
        
        [Required]
        public DateTime Date { get; set; }
        public bool InQuestion { get; set; }
        public string MachType { get; set; }
        
    }
}