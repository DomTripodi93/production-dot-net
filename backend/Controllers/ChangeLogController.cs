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
using BackEnd.Helpers;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/{userId}/[controller]")]
    [ApiController]
    
    public class ChangeLogController: ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _repo;

        public ChangeLogController(IMapper mapper, IUserRepository repo)
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

            changeLog.TimeStamp = DateTime.Now;

            changeLog.userId = userId;

            _repo.Add(changeLog);

            if (await _repo.SaveAll())
            {
                return Ok();
            }
                
            throw new Exception("Creation of changeLog count failed on save");
        }

        [HttpGet("{model}")]
        public async Task<IActionResult> GetChangeLog(int userId, string model, [FromQuery]PagingParams changeLogParams)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var changeLog = await _repo.GetChangeLog(userId, model, changeLogParams);

            var changeLogForReturn = _mapper.Map<IEnumerable<ChangelogForReturnDto>>(changeLog);

            Response.AddPagination(changeLog.CurrentPage, changeLog.PageSize, changeLog.TotalCount, changeLog.TotalPages);
            
            return Ok(changeLogForReturn);
        }
        
    }
}