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
            CreateMap<ProdForUpdateDto, Production>().ReverseMap();
            CreateMap<ProdForQuestionDto, Production>().ReverseMap();
            CreateMap<Part, PartForReturnDto>();
            CreateMap<PartForCreationDto, Part>().ReverseMap();
            CreateMap<UpdateActiveDto, Part>().ReverseMap();
            CreateMap<Hourly, HourlyForReturnDto>();
            CreateMap<HourlyForCreationDto, Hourly>().ReverseMap();
            CreateMap<HourlyForStartTimeDto, Hourly>().ReverseMap();
            CreateMap<Job, JobForReturnDto>();
            CreateMap<JobForCreationDto, Job>().ReverseMap();
            CreateMap<JobForUpdateDto, Job>().ReverseMap();
            CreateMap<RemainingDto, Job>().ReverseMap();
            CreateMap<UpdateActiveDto, Job>().ReverseMap();
            CreateMap<ChangeLog, ChangelogForReturnDto>();
            CreateMap<ChangelogForCreationDto, ChangeLog>().ReverseMap();
            CreateMap<Settings, SettingsForReturnDto>();
            CreateMap<SettingsForCreationDto, Settings>().ReverseMap();
            CreateMap<Operation, OperationForReturnDto>();
            CreateMap<OperationForCreationDto, Operation>().ReverseMap();
            CreateMap<OperationForUpdateDto, Operation>().ReverseMap();
            CreateMap<OpPartsToDateDto, Operation>().ReverseMap();
            CreateMap<RemainingDto, Operation>().ReverseMap();
        }
    }
}