using System;

namespace BackEnd.Models
{
    public class ChangeLog
    {
        public int Id { get; set; }
        public User User { get; set; }
        public int userId { get; set; }
        public string ChangedModel { get; set; }
        public string ChangeType { get; set; }
        public string ChangedId { get; set; }
        public string OldValues { get; set; }
        public DateTime TimeStamp { get; set; }
    }
}