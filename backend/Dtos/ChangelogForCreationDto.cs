using System;

namespace BackEnd.Dtos
{
    public class ChangelogForCreationDto
    {
        public string ChangedModel { get; set; }
        public string ChangeType { get; set; }
        public string ChangedId { get; set; }
        public string OldValues { get; set; }
        public DateTime TimeStamp { get; set; }
        
    }
}