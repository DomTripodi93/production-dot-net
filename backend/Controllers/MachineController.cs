using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using BackEnd.Data;
using BackEnd.Dtos;
using BackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers
{
    [Authorize]
    [Route("api/{userId}/[controller]")]
    [ApiController]
    public class MachineController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IManagementRepository _repo;

        public MachineController(IMapper mapper, IManagementRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpPost]
        public async Task<IActionResult> AddMachine(int userId, MachForCreationDto machForCreationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var mach = _mapper.Map<Mach>(machForCreationDto);

            mach.userId = userId;

            _repo.Add(mach);

            if (await _repo.SaveAll())
            {
                var machToReturn = _mapper.Map<MachForCreationDto>(mach);
                return CreatedAtRoute("GetMach", new {mach = mach.Machine}, machToReturn);
            }
                
            throw new Exception("Creation of machine failed on save");
        }

        [HttpPut("{mach}")]
        public async Task<IActionResult> UpdateMachine(int userId, string mach, MachForCreationDto machForUpdateDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var machFromRepo = await _repo.GetMachine(userId, mach);

            _mapper.Map(machForUpdateDto, machFromRepo);

            if (await _repo.SaveAll())
                return CreatedAtRoute("GetMach", new {machine = machFromRepo.Machine}, machForUpdateDto);

            throw new Exception($"Updating machine {mach} failed on save");
        }

        [HttpGet("{mach}", Name = "GetMach")]
        public async Task<IActionResult> GetMachine(string mach, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            Mach machine = await _repo.GetMachine(userId, mach);
            MachForReturnDto machForReturn = _mapper.Map<MachForReturnDto>(machine);
            return Ok(machForReturn);
        }


        [HttpGet]
        public async Task<IActionResult> GetMachines(int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            IEnumerable<Mach> directMachines = await _repo.GetMachines(userId);

            var machines = _mapper.Map<IEnumerable<MachForReturnDto>>(directMachines);

            return Ok(machines);
        }

        [HttpGet("jobs")]
        public async Task<IActionResult> GetMachinesByJob(int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            IEnumerable<Mach> directMachines = await _repo.GetMachinesByJob(userId);

            var machines = _mapper.Map<IEnumerable<MachForReturnDto>>(directMachines);

            return Ok(machines);
        }

        [HttpDelete("{mach}")]
        public async Task<IActionResult> DeleteMachine(int userId, string mach)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var machToDelete = await _repo.GetMachine(userId, mach);
            
            if (userId == int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                _repo.Delete(machToDelete);
                await _repo.SaveAll();
                return Ok(machToDelete.Machine +" was deleted!");
            

        }
        
    }
}