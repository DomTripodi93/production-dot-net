using System.Collections.Generic;

namespace BackEnd.Models
{
    public class Job
    {
        public int Id { get; set; }
        public User User { get; set; }
        public int userId { get; set; }
        public Part Part { get; set; }
        public int partId { get; set; }
        public string PartNum { get; set; }
        public string JobNumber { get; set; }
        public ICollection<Operation> Operation { get; set; }
        
    }
}