using System.ComponentModel.DataAnnotations;

namespace BackEnd.Dtos
{
    public class MachForCreationDto
    {
        [Required]
        public string Machine { get; set; }
        public string CurrentJob { get; set; }
        public string CurrentOp { get; set; }
    }
}