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
    public class JobController: ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IManagementRepository _repo;

        public JobController(IMapper mapper, IManagementRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }
        


        [HttpPost]
        public async Task<IActionResult> AddJob(int userId, JobForCreationDto jobForCreationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var job = _mapper.Map<Job>(jobForCreationDto);

            var partInfo = await _repo.GetPart(jobForCreationDto.PartId);

            job.PartNum = partInfo.PartNumber;
            job.userId = userId;

            _repo.Add(job);

            if (await _repo.SaveAll())
            {
                var jobToReturn = _mapper.Map<JobForReturnDto>(job);
                return CreatedAtRoute("GetJob", new {id = job.Id}, jobToReturn);
            }
                
            throw new Exception("Creation of job lot failed on save");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(int id, JobForCreationDto jobForUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var jobFromRepo = await _repo.GetJob(id);

            _mapper.Map(jobForUpdateDto, jobFromRepo);

            if (await _repo.SaveAll())
                return CreatedAtRoute("GetJob", new {id = jobFromRepo.Id}, jobForUpdateDto);

            throw new Exception($"Updating job lot {id} failed on save");
        }

        [HttpGet("{id}", Name = "GetJob")]
        public async Task<IActionResult> GetJob(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            Job job = await _repo.GetJob(id);
            JobForReturnDto jobForReturn = _mapper.Map<JobForReturnDto>(job);
            return Ok(jobForReturn);
        }


        [HttpGet]
        public async Task<IActionResult> GetJobs(int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            IEnumerable<Job> directJobs = await _repo.GetJobs(userId);

            var jobs = _mapper.Map<IEnumerable<JobForReturnDto>>(directJobs);

            return Ok(jobs);
        }

        [HttpGet("job={jobNum}")]
        public async Task<IActionResult> GetJobsByJob(int userId, string jobNum)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            IEnumerable<Job> directJobs = await _repo.GetJobByNumber(userId, jobNum);

            var jobs = _mapper.Map<IEnumerable<JobForReturnDto>>(directJobs);

            return Ok(jobs);
        }

        [HttpGet("job={jobNum}&op={op}")]
        public async Task<IActionResult> GetJobsByJobAndOp(int userId, string jobNum, string op)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            Job directJob = await _repo.GetJobByNumberAndOp(userId, jobNum, op);

            var job = _mapper.Map<JobForReturnDto>(directJob);

            return Ok(job);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var jobToDelete = await _repo.GetJob(id);
            
            if (userId == int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                _repo.Delete(jobToDelete);
                await _repo.SaveAll();
                return Ok(
                            "Operation "
                            + jobToDelete.Operation
                            + " for job# " 
                            + jobToDelete.JobNumber 
                            +" was deleted, along with related production lots and hourly counts!"
                        );
        }
        
    }
}