using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using backend.Data;
using backend.Dtos;
using BackEnd.Data;
using BackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
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
            var creater = await _repo.GetUser(userId);

            if (creater.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var mach = _mapper.Map<Mach>(machForCreationDto);

            mach.userId = userId;

            _repo.Add(mach);

            if (await _repo.SaveAll())
            {
                var machToReturn = _mapper.Map<MachForCreationDto>(mach);
                return CreatedAtRoute("GetMach", new {id = mach.Id}, machToReturn);
            }
                
            throw new Exception("Creation of machine failed on save");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMachine(int id, MachForCreationDto machForUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var machFromRepo = await _repo.GetMachine(id);

            _mapper.Map(machForUpdateDto, machFromRepo);

            if (await _repo.SaveAll())
                return CreatedAtRoute("GetMach", new {id = machFromRepo.Id}, machForUpdateDto);

            throw new Exception($"Updating machine {id} failed on save");
        }

        [HttpGet("{id}", Name = "GetMach")]
        public async Task<IActionResult> GetMachine(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            Mach machine = await _repo.GetMachine(id);
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

        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteMachine(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var machToDelete = await _repo.GetMachine(id);
            
            if (userId == int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                _repo.Delete(machToDelete);
                await _repo.SaveAll();
                return Ok(machToDelete.Machine +" was deleted!");
            

        }
        
    }
}