using System;

namespace BackEnd.Dtos
{
    public class ChangelogForReturnDto
    {
        public int Id { get; set; }
        public string ChangedModel { get; set; }
        public string ChangeType { get; set; }
        public string ChangedId { get; set; }
        public DateTime TimeStamp { get; set; }
        public string OldValues { get; set; }
        
    }
}