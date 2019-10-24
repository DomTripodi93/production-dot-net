using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using BackEnd.Models;

namespace BackEnd.Models
{
    public class Part
    {
        public User User { get; set; }
        public int userId { get; set; }
        public string PartNumber { get; set; }
        public string MachType { get; set; }
        public ICollection<Job> Jobs { get; set; }
    }
}