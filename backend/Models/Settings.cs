using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class Settings
    {
        public int Id { get; set; }
        public User User { get; set; }

        [Key]
        public int userId { get; set; }
        public bool IsNew { get; set; }
    }
}