namespace BackEnd.Dtos
{
    public class JobForReturnDto
    {
        public int Id { get; set; }
        public string PartNumber { get; set; }
        public string Machine { get; set; }
        public string Job { get; set; }
        public string OrderQuantity { get; set; }
        public string PossibleQuantity { get; set; }
        public string RemainingQuantity { get; set; }
        public string WeightQuantity { get; set; }
        public string WeightLength { get; set; }
        public string WeightRecieved { get; set; }
        public string Oal { get; set; }
        public string CutOff { get; set; }
        public string MainFacing { get; set; }
        public string SubFacing { get; set; }
        public string HeatLot { get; set; }
        public string CycleTime { get; set; }
        public string Bars { get; set; }
        
    }
}