using System.ComponentModel.DataAnnotations;

namespace BackEnd.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        public string Name { get; set; }

        [Required]
        [StringLength(25, MinimumLength=6, ErrorMessage="Password must be at least 6 characters")]

        public string Password { get; set; }
    }
}