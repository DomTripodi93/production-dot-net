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

    public class OperationController: ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IManagementRepository _repo;

        public OperationController(IMapper mapper, IManagementRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpPost]
        public async Task<IActionResult> AddOperation(int userId, OperationForCreationDto opForCreationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var op = _mapper.Map<Operation>(opForCreationDto);

            var jobInfo = await _repo.GetJob(userId, opForCreationDto.JobNumber);

            op.JobNumber = jobInfo.JobNumber;
            op.userId = userId;

            _repo.Add(op);

            if (await _repo.SaveAll())
            {
                var opToReturn = _mapper.Map<OperationForReturnDto>(op);
                return CreatedAtRoute("GetOp", new {id = op.Id}, opToReturn);
            }
                
            throw new Exception("Creation of op lot failed on save");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOperation(int id, OperationForCreationDto opForUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var opFromRepo = await _repo.GetOp(id);

            _mapper.Map(opForUpdateDto, opFromRepo);

            if (await _repo.SaveAll())
                return CreatedAtRoute("GetOp", new {id = opFromRepo.Id}, opForUpdateDto);

            throw new Exception($"Updating op lot {id} failed on save");
        }

        [HttpGet("{id}", Name = "GetOp")]
        public async Task<IActionResult> GetOp(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            Operation op = await _repo.GetOp(id);
            OperationForReturnDto opForReturn = _mapper.Map<OperationForReturnDto>(op);
            return Ok(opForReturn);
        }

        [HttpGet("job={jobNum}")]
        public async Task<IActionResult> GetOperationsByOperation(int userId, string jobNum)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            IEnumerable<Operation> directOperations = await _repo.GetOpsByJob(jobNum);

            var ops = _mapper.Map<IEnumerable<OperationForReturnDto>>(directOperations);

            return Ok(ops);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOperation(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var opToDelete = await _repo.GetOp(id);
            
            if (userId == int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                _repo.Delete(opToDelete);
                await _repo.SaveAll();
                return Ok(
                            "Operation "
                            + opToDelete.OpNumber
                            + " for job# " 
                            + opToDelete.JobNumber 
                            +" was deleted, along with related production lots and hourly counts!"
                        );
        }
        
    }
}