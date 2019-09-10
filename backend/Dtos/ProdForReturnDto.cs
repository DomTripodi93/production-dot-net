using System;

namespace BackEnd.Dtos
{
    public class ProdForReturnDto
    {
        public int Id { get; set; }
        public string PartNumber { get; set; }
        public string Machine { get; set; }
        public string JobNumber { get; set; }
        public int JobId { get; set; }
        public string Operation { get; set; }
        public string Shift { get; set; }
        public string Quantity { get; set; }
        public DateTime Date { get; set; }
        public bool InQuestion { get; set; }
        
    }
}