using System.ComponentModel.DataAnnotations;

namespace BackEnd.Dtos
{
    public class JobForCreationDto
    {
        [Required]
        public int PartId { get; set; }
        
        [Required]
        public string JobNumber { get; set; }
        
    }
}