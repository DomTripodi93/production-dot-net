using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using BackEnd.Data;
using BackEnd.Models;
using BackEnd.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/{userId}/[controller]")]
    [ApiController]
    
    public class ChangeLogController: ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IManagementRepository _repo;

        public ChangeLogController(IMapper mapper, IManagementRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }
        


        [HttpPost]
        public async Task<IActionResult> AddChangeLog(int userId, ChangelogForCreationDto changeLogForCreationDto)
        {
            var creator = await _repo.GetUser(userId);

            if (creator.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var changeLog = _mapper.Map<ChangeLog>(changeLogForCreationDto);

            changeLog.userId = userId;

            _repo.Add(changeLog);

            if (await _repo.SaveAll())
            {
                return Ok();
            }
                
            throw new Exception("Creation of changeLog count failed on save");
        }

        [HttpGet("{model}")]
        public async Task<IActionResult> GetChangeLog(int userId, string model)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            IEnumerable<ChangeLog> changeLog = await _repo.GetChangeLog(userId, model);

            IEnumerable<ChangelogForReturnDto> changeLogForReturn = _mapper.Map<IEnumerable<ChangelogForReturnDto>>(changeLog);
            return Ok(changeLogForReturn);
        }
        
    }
}