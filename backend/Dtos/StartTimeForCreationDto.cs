using System;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Dtos
{
    public class StartTimeForCreationDto
    {
        
        [Required]
        public string Machine { get; set; }
        
        [Required]
        public DateTime Date { get; set; }
        
    }
}