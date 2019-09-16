namespace BackEnd.Dtos
{
    public class OperationForReturnDto
    {
        public int Id { get; set; }
        public string JobNumber { get; set; }
        public string PartsToDate { get; set; }
        public string OpNumber { get; set; }
        public string Machine { get; set; }
        public string RemainingQuantity { get; set; }
        public string CycleTime { get; set; }
        
    }
}