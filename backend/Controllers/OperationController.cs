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
                return CreatedAtRoute("GetOp", new {jobNum = op.JobNumber, opNum = op.OpNumber}, opToReturn);
            }
                
            throw new Exception("Creation of op lot failed on save");
        }

        [HttpPut("op={opNum}&job={jobNum}")]
        public async Task<IActionResult> UpdateOperation(int userId, string jobNum, string opNum, OperationForUpdateDto opForUpdateDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var opFromRepo = await _repo.GetOp(userId, jobNum, opNum);

            _mapper.Map(opForUpdateDto, opFromRepo);

            if (await _repo.SaveAll())
                return CreatedAtRoute("GetOp", new {jobNum = opFromRepo.JobNumber, opNum = opFromRepo.OpNumber}, opForUpdateDto);

            throw new Exception($"Updating op operation {opNum} for {jobNum} failed on save");
        }

        [HttpPut("remaining/op={opNum}&job={jobNum}")]
        public async Task<IActionResult> UpdateOperationRemaining(int userId, string jobNum, string opNum, OperationForRemainingDto opForRemainingDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var opFromRepo = await _repo.GetOp(userId, jobNum, opNum);

            _mapper.Map(opForRemainingDto, opFromRepo);

            if (await _repo.SaveAll())
                return CreatedAtRoute("GetOp", new {jobNum = opFromRepo.JobNumber, opNum = opFromRepo.OpNumber}, opForRemainingDto);

            throw new Exception($"Updating op operation {opNum} for {jobNum} failed on save");
        }

        [HttpPut("toDate/op={opNum}&job={jobNum}")]
        public async Task<IActionResult> UpdateOperationPartsToDate(int userId, string jobNum, string opNum, OpPartsToDateDto opPartsToDateDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var opFromRepo = await _repo.GetOp(userId, jobNum, opNum);

            _mapper.Map(opPartsToDateDto, opFromRepo);

            if (await _repo.SaveAll())
                return CreatedAtRoute("GetOp", new {jobNum = opFromRepo.JobNumber, opNum = opFromRepo.OpNumber}, opPartsToDateDto);

            throw new Exception($"Updating op operation {opNum} for {jobNum} failed on save");
        }

        [HttpGet("op={opNum}&job={jobNum}", Name = "GetOp")]
        public async Task<IActionResult> GetOp(string jobNum, string opNum, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            Operation op = await _repo.GetOp(userId, jobNum, opNum);
            OperationForReturnDto opForReturn = _mapper.Map<OperationForReturnDto>(op);
            return Ok(opForReturn);
        }

        [HttpGet("job={jobNum}")]
        public async Task<IActionResult> GetOperationsByJob(int userId, string jobNum)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            IEnumerable<Operation> directOperations = await _repo.GetOpsByJob(userId, jobNum);

            var ops = _mapper.Map<IEnumerable<OperationForReturnDto>>(directOperations);

            return Ok(ops);
        }

        [HttpGet("mach={mach}&job={jobNum}")]
        public async Task<IActionResult> GetOperationsByMach(int userId, string jobNum,  string mach)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            IEnumerable<Operation> directOperations = await _repo.GetOpsByMach(userId, jobNum,  mach);

            var ops = _mapper.Map<IEnumerable<OperationForReturnDto>>(directOperations);

            return Ok(ops);
        }

        [HttpDelete("op={opNum}&job={jobNum}")]
        public async Task<IActionResult> DeleteOperation(int userId, string jobNum, string opNum)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var opToDelete = await _repo.GetOp(userId, jobNum, opNum);
            
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