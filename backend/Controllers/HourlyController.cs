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

    public class HourlyController: ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IManagementRepository _repo;

        public HourlyController(IMapper mapper, IManagementRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }
        

        [HttpPost]
        public async Task<IActionResult> AddHourly(int userId,  HourlyForCreationDto hourlyForCreationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var hourly = _mapper.Map<Hourly>(hourlyForCreationDto);

            var opInfo = await _repo.GetOp(hourly.JobNumber, hourly.OpNumber);

            hourly.userId = userId;

            _repo.Add(hourly);

            if (await _repo.SaveAll())
            {
                var hourlyToReturn = _mapper.Map<HourlyForCreationDto>(hourly);
                return CreatedAtRoute("GetHourly", new {id = hourly.Id}, hourlyToReturn);
            }
                
            throw new Exception("Creation of hourly count failed on save");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHourly(int userId, int id, HourlyForCreationDto hourlyForUpdateDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var hourlyFromRepo = await _repo.GetHourly(id);

            _mapper.Map(hourlyForUpdateDto, hourlyFromRepo);

            if (await _repo.SaveAll())
                return CreatedAtRoute("GetHourly", new {id = hourlyFromRepo.Id}, hourlyForUpdateDto);

            throw new Exception($"Updating hourly count {id} failed on save");
        }

        [HttpPut("startTime/{id}")]
        public async Task<IActionResult> UpdateStartTimeHourly(int userId, int id, HourlyForStartTimeDto hourlyForUpdateDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var hourlyFromRepo = await _repo.GetHourly(id);

            _mapper.Map(hourlyForUpdateDto, hourlyFromRepo);

            if (await _repo.SaveAll())
                return CreatedAtRoute("GetHourly", new {id = hourlyFromRepo.Id}, hourlyForUpdateDto);

            throw new Exception($"Updating hourly count {id} failed on save");
        }

        [HttpGet("{id}", Name = "GetHourly")]
        public async Task<IActionResult> GetHourly(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            Hourly hourly = await _repo.GetHourly(id);
            HourlyForReturnDto hourlyForReturn = _mapper.Map<HourlyForReturnDto>(hourly);
            return Ok(hourlyForReturn);
        }


        [HttpGet]
        public async Task<IActionResult> GetHourlySet(int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            IEnumerable<Hourly> directHourlySet = await _repo.GetHourlySet(userId);

            var hourlySet = _mapper.Map<IEnumerable<HourlyForReturnDto>>(directHourlySet);

            return Ok(hourlySet);
        }

        [HttpGet("date={date}&machine={mach}")]
        public async Task<IActionResult> GetHourlySetByDateAndMachine(int userId, string mach, string date)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            IEnumerable<Hourly> directHourlySet = await _repo.GetHourlySetByDateAndMachine(userId, date, mach);

            var hourlySet = _mapper.Map<IEnumerable<HourlyForReturnDto>>(directHourlySet);

            return Ok(hourlySet);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHourly(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var hourlyToDelete = await _repo.GetHourly(id);
            
            if (userId == int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                _repo.Delete(hourlyToDelete);
                await _repo.SaveAll();
                return Ok(
                            hourlyToDelete.Time
                            + " hourly count for job# " 
                            + hourlyToDelete.JobNumber
                            +" running on the " 
                            + hourlyToDelete.Machine 
                            +" was deleted!"
                        );
        }
        
    }
}