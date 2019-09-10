using System.ComponentModel.DataAnnotations;

namespace BackEnd.Dtos
{
    public class PartForCreationDto
    {
        
        [Required]
        public string PartNumber { get; set; }
    }
}