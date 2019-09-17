using System.ComponentModel.DataAnnotations;

namespace BackEnd.Dtos
{
    public class OperationForCreationDto
    {
        public string PartNum { get; set; }

        [Required]
        public string JobNumber { get; set; }
        public string PartsToDate { get; set; }

        [Required]
        public string OpNumber { get; set; }
        public string Machine { get; set; }
        public string RemainingQuantity { get; set; }
        public string CycleTime { get; set; }
        
    }
}