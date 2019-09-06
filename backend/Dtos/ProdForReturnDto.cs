using System;

namespace backend.Dtos
{
    public class ProdForReturnDto
    {
        public int Id { get; set; }
        public string PartNumber { get; set; }
        public string Machine { get; set; }
        public string Job { get; set; }
        public string Shift { get; set; }
        public string Quantity { get; set; }
        public DateTime Date { get; set; }
        public bool InQuestion { get; set; }
        
    }
}