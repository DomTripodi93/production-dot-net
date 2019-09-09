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
    public class StartTimeController: ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IManagementRepository _repo;

        public StartTimeController(IMapper mapper, IManagementRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }
        


        [HttpPost("{machId}")]
        public async Task<IActionResult> AddStartTime(int userId, int machId, StartTimeForCreationDto startTimeForCreationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var startTime = _mapper.Map<StartTime>(startTimeForCreationDto);

            var machToStart = await _repo.GetMachine(machId);

            startTime.Machine = machToStart;
            startTime.MachId = machToStart.Id;

            _repo.Add(startTime);

            if (await _repo.SaveAll())
            {
                var startTimeToReturn = _mapper.Map<StartTimeForCreationDto>(startTime);
                return CreatedAtRoute("GetStartTime", new {id = startTime.Id}, startTimeToReturn);
            }
                
            throw new Exception("Creation of startTime lot failed on save");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStartTime(int userId, int id, StartTimeForCreationDto startTimeForUpdateDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var startTimeFromRepo = await _repo.GetUniqueStartTime(id);

            _mapper.Map(startTimeForUpdateDto, startTimeFromRepo);

            if (await _repo.SaveAll())
                return CreatedAtRoute("GetStartTime", new {id = startTimeFromRepo.Id}, startTimeForUpdateDto);

            throw new Exception($"Updating startTime lot {id} failed on save");
        }

        [HttpGet("machine={mach}&date={date}&shift={shift}")]
        public async Task<IActionResult> GetStartTimeSetByMachine(int userId, int machId, string date, string shift)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            StartTime directStartTime = await _repo.GetStartTime(userId, date, machId, shift);

            var startTimeSet = _mapper.Map<StartTimeForReturnDto>(directStartTime);

            return Ok(startTimeSet);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStartTime(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var startTimeToDelete = await _repo.GetUniqueStartTime(id);
            
            if (userId == int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                _repo.Delete(startTimeToDelete);
                await _repo.SaveAll();
                return Ok(
                            startTimeToDelete.Date.ToString("MM/dd/yyyy")
                            + " start time for "
                            + startTimeToDelete.Shift
                            + " shift on the "
                            + startTimeToDelete.Machine 
                            +" was deleted!"
                        );
        }
        
    }
}