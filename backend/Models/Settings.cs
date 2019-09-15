using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Models
{
    public class Settings
    {
        public User User { get; set; }
        public int userId { get; set; }
        public bool IsNew { get; set; }
    }
}