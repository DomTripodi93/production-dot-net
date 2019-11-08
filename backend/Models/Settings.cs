using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Models
{
    public class Settings
    {
        public User User { get; set; }
        public int userId { get; set; }
        public bool IsNew { get; set; }
        public bool SkipLathe { get; set; }
        public bool SkipMill { get; set; }
        public string DefaultStartTime { get; set; }
        public string DefaultBarEnd { get; set; }
        public string DefaultBarCut { get; set; }
    }
}