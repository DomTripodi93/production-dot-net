using AutoMapper;
using backend.Dtos;
using BackEnd.Models;

namespace backend.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForReturnDto>();
            CreateMap<Mach, MachForReturnDto>();
            CreateMap<MachForCreationDto, Mach>().ReverseMap();
        }
    }
}