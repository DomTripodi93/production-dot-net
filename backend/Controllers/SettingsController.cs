using System;
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
        private readonly IUserRepository _repo;

        public SettingsController(IMapper mapper, IUserRepository repo)
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
                return CreatedAtRoute("GetSettings", new {id = settings.userId, userId = userId }, settingsToReturn);
            }
                
            throw new Exception("Creation of settings count failed on save");
        }

        [HttpPut("new")]
        public async Task<IActionResult> UpdateSettingsNew(int userId, SettingsForCreationDto settingsForUpdateDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var settingsFromRepo = await _repo.GetSettings(userId);

            settingsFromRepo.IsNew = settingsForUpdateDto.IsNew;


            if (await _repo.SaveAll())
                return CreatedAtRoute("GetSettings", new {id = settingsFromRepo.userId, userId = userId }, settingsForUpdateDto);

            throw new Exception($"Updating settings for {userId} failed on save");
        }

        [HttpPut("lathe")]
        public async Task<IActionResult> UpdateSettingsLathe(int userId, SettingsForCreationDto settingsForUpdateDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var settingsFromRepo = await _repo.GetSettings(userId);

            settingsFromRepo.SkipLathe = settingsForUpdateDto.SkipLathe;


            if (await _repo.SaveAll())
                return CreatedAtRoute("GetSettings", new {id = settingsFromRepo.userId, userId = userId }, settingsForUpdateDto);

            throw new Exception($"Updating settings for {userId} failed on save");
        }

        [HttpPut("mill")]
        public async Task<IActionResult> UpdateSettingsMill(int userId, SettingsForCreationDto settingsForUpdateDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var settingsFromRepo = await _repo.GetSettings(userId);

            settingsFromRepo.SkipMill = settingsForUpdateDto.SkipMill;


            if (await _repo.SaveAll())
                return CreatedAtRoute("GetSettings", new {id = settingsFromRepo.userId, userId = userId }, settingsForUpdateDto);

            throw new Exception($"Updating settings for {userId} failed on save");
        }

        [HttpPut("time")]
        public async Task<IActionResult> UpdateSettingsStartTime(int userId, SettingsForCreationDto settingsForUpdateDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var settingsFromRepo = await _repo.GetSettings(userId);

            settingsFromRepo.DefaultStartTime = settingsForUpdateDto.DefaultStartTime;


            if (await _repo.SaveAll())
                return CreatedAtRoute("GetSettings", new {id = settingsFromRepo.userId, userId = userId }, settingsForUpdateDto);

            throw new Exception($"Updating settings for {userId} failed on save");
        }

        [HttpPut("end")]
        public async Task<IActionResult> UpdateSettingsBarEnd(int userId, SettingsForCreationDto settingsForUpdateDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var settingsFromRepo = await _repo.GetSettings(userId);

            settingsFromRepo.DefaultBarEnd = settingsForUpdateDto.DefaultBarEnd;


            if (await _repo.SaveAll())
                return CreatedAtRoute("GetSettings", new {id = settingsFromRepo.userId, userId = userId }, settingsForUpdateDto);

            throw new Exception($"Updating settings for {userId} failed on save");
        }

        [HttpPut("cut")]
        public async Task<IActionResult> UpdateSettingsBarCut(int userId, SettingsForCreationDto settingsForUpdateDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var settingsFromRepo = await _repo.GetSettings(userId);

            settingsFromRepo.DefaultBarCut = settingsForUpdateDto.DefaultBarCut;


            if (await _repo.SaveAll())
                return CreatedAtRoute("GetSettings", new {id = settingsFromRepo.userId, userId = userId }, settingsForUpdateDto);

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