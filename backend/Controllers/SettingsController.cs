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
    public class SettingsController: ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IManagementRepository _repo;

        public SettingsController(IMapper mapper, IManagementRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }
        


        [HttpPost]
        public async Task<IActionResult> AddSettings(int userId, SettingsForCreationDto settingsForCreationDto)
        {
            var creator = await _repo.GetUser(userId);

            if (creator.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var settings = _mapper.Map<Settings>(settingsForCreationDto);

            settings.userId = userId;

            _repo.Add(settings);

            if (await _repo.SaveAll())
            {
                var settingsToReturn = _mapper.Map<SettingsForCreationDto>(settings);
                return CreatedAtRoute("GetSettings", new {id = settings.Id}, settingsToReturn);
            }
                
            throw new Exception("Creation of settings count failed on save");
        }

        [HttpPut]
        public async Task<IActionResult> UpdateSettings(int userId, SettingsForCreationDto settingsForUpdateDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var settingsFromRepo = await _repo.GetSettings(userId);

            _mapper.Map(settingsForUpdateDto, settingsFromRepo);

            if (await _repo.SaveAll())
                return CreatedAtRoute("GetSettings", new {id = settingsFromRepo.Id}, settingsForUpdateDto);

            throw new Exception($"Updating settings for {userId} failed on save");
        }

        [HttpGet(Name = "GetSettings")]
        public async Task<IActionResult> GetSettings(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            Settings settings = await _repo.GetSettings(userId);
            SettingsForReturnDto settingsForReturn = _mapper.Map<SettingsForReturnDto>(settings);
            return Ok(settingsForReturn);
        }
        
    }
}