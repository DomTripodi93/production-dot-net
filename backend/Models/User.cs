using System.Collections.Generic;

namespace BackEnd.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public ICollection<Mach> Machine { get; set; }
        public ICollection<Part> Part { get; set; }
        public ICollection<Hourly> Hourly { get; set; }
        public ICollection<Production> Production { get; set; }
        public ICollection<Settings> Settings { get; set; }
        public ICollection<ChangeLog> ChangeLog { get; set; }
    }
}