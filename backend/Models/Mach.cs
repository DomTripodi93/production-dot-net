using System.Collections.Generic;

namespace BackEnd.Models
{
    public class Mach
    {
        public User User { get; set; }
        public int userId { get; set; }
        public string Machine { get; set; }
        public string CurrentJob { get; set; }
        public string CurrentOp { get; set; }
        public ICollection<StartTime> StartTimes { get; set; }
    }
}