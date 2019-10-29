using System.Collections.Generic;

namespace BackEnd.Models
{
    public class Job
    {
        public User User { get; set; }
        public int userId { get; set; }
        public Part Part { get; set; }
        public string PartNum { get; set; }
        public string JobNumber { get; set; }
        public string OrderQuantity { get; set; }
        public string PossibleQuantity { get; set; }
        public string RemainingQuantity { get; set; }
        public string MatRecieved { get; set; }
        public string WeightQuantity { get; set; }
        public string WeightLength { get; set; }
        public string WeightRecieved { get; set; }
        public string Oal { get; set; }
        public string CutOff { get; set; }
        public string MainFacing { get; set; }
        public string SubFacing { get; set; }
        public string HeatLot { get; set; }
        public string Bars { get; set; }
        public string MachType { get; set; }
        public string ScrapCount { get; set; }
        public ICollection<Operation> Operation { get; set; }
        
    }
}