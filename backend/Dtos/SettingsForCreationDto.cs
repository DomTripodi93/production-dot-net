using BackEnd.Models;

namespace BackEnd.Dtos
{
    public class SettingsForCreationDto
    {
        public bool IsNew { get; set; }
        public bool SkipLathe { get; set; }
        public bool SkipMill { get; set; }
        public string DefaultStartTime { get; set; }
        public string DefaultBarEnd { get; set; }
        public string DefaultBarCut { get; set; }
        
    }
}