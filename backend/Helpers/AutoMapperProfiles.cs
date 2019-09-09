using AutoMapper;
using BackEnd.Dtos;
using BackEnd.Models;

namespace BackEnd.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForReturnDto>();
            CreateMap<Mach, MachForReturnDto>();
            CreateMap<MachForCreationDto, Mach>().ReverseMap();
            CreateMap<Production, ProdForReturnDto>();
            CreateMap<ProdForCreationDto, Production>().ReverseMap();
            CreateMap<Part, PartForReturnDto>();
            CreateMap<PartForCreationDto, Part>().ReverseMap();
            CreateMap<Hourly, HourlyForReturnDto>();
            CreateMap<HourlyForCreationDto, Hourly>().ReverseMap();
            CreateMap<Job, JobForReturnDto>();
            CreateMap<JobForCreationDto, Job>().ReverseMap();
            CreateMap<ChangeLog, ChangelogForReturnDto>();
            CreateMap<ChangelogForCreationDto, ChangeLog>().ReverseMap();
            CreateMap<Settings, SettingsForReturnDto>();
            CreateMap<SettingsForCreationDto, Settings>().ReverseMap();
            CreateMap<StartTime, StartTimeForReturnDto>();
            CreateMap<StartTimeForCreationDto, StartTime>().ReverseMap();
        }
    }
}