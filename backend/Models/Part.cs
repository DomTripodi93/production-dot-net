using System.Collections.Generic;
using BackEnd.Models;

namespace BackEnd.Models
{
    public class Part
    {
        public int Id { get; set; }
        public User User { get; set; }
        public int userId { get; set; }
        public string PartNumber { get; set; }
        public ICollection<Job> Jobs { get; set; }
    }
}