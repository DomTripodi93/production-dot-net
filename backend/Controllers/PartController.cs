using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using backend.Data;
using backend.Dtos;
using BackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/{userId}/[controller]")]
    [ApiController]
    public class PartController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IManagementRepository _repo;

        public PartController(IMapper mapper, IManagementRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }
        


        [HttpPost]
        public async Task<IActionResult> AddPart(int userId, PartForCreationDto partForCreationDto)
        {
            var creater = await _repo.GetUser(userId);

            if (creater.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var part = _mapper.Map<Part>(partForCreationDto);

            part.userId = userId;

            _repo.Add(part);

            if (await _repo.SaveAll())
            {
                var partToReturn = _mapper.Map<PartForCreationDto>(part);
                return CreatedAtRoute("GetPart", new {id = part.Id}, partToReturn);
            }
                
            throw new Exception("Creation of part lot failed on save");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePart(int id, PartForCreationDto partForUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var partFromRepo = await _repo.GetPart(id);

            _mapper.Map(partForUpdateDto, partFromRepo);

            if (await _repo.SaveAll())
                return CreatedAtRoute("GetPart", new {id = partFromRepo.Id}, partForUpdateDto);

            throw new Exception($"Updating part lot {id} failed on save");
        }

        [HttpGet("{id}", Name = "GetPart")]
        public async Task<IActionResult> GetPart(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            Part part = await _repo.GetPart(id);
            PartForReturnDto partForReturn = _mapper.Map<PartForReturnDto>(part);
            return Ok(partForReturn);
        }


        [HttpGet]
        public async Task<IActionResult> GetParts(int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            IEnumerable<Part> directParts = await _repo.GetParts(userId);

            var parts = _mapper.Map<IEnumerable<PartForReturnDto>>(directParts);

            return Ok(parts);
        }

        [HttpGet("machine={mach}")]
        public async Task<IActionResult> GetPartsByMachine(int userId, string mach)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            IEnumerable<Part> directParts = await _repo.GetPartsByMachine(userId, mach);

            var parts = _mapper.Map<IEnumerable<PartForReturnDto>>(directParts);

            return Ok(parts);
        }

        [HttpGet("job={job}")]
        public async Task<IActionResult> GetPartsByJob(int userId, string job)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            IEnumerable<Part> directParts = await _repo.GetPartsByJob(userId, job);

            var parts = _mapper.Map<IEnumerable<PartForReturnDto>>(directParts);

            return Ok(parts);
        }

        [HttpGet("part={part}")]
        public async Task<IActionResult> GetPartsByPart(int userId, string part)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            IEnumerable<Part> directParts = await _repo.GetPartsByPart(userId, part);

            var parts = _mapper.Map<IEnumerable<PartForReturnDto>>(directParts);

            return Ok(parts);
        }
    }
}