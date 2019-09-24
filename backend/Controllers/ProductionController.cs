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
    public class ProductionController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IManagementRepository _repo;

        public ProductionController(IMapper mapper, IManagementRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }
        


        [HttpPost]
        public async Task<IActionResult> AddProduction(int userId, ProdForCreationDto prodForCreationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var production = _mapper.Map<Production>(prodForCreationDto);

            var opInfo = await _repo.GetOp(production.JobNumber, production.OpNumber);

            production.userId = userId;
            production.InQuestion = false;
            production.OpNumber = opInfo.OpNumber;

            _repo.Add(production);

            if (await _repo.SaveAll())
            {
                var prodToReturn = _mapper.Map<ProdForReturnDto>(production);
                return CreatedAtRoute("GetProd", new {id = production.Id}, prodToReturn);
            }
                
            throw new Exception("Creation of production lot failed on save");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduction(int id, ProdForUpdateDto prodForUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var prodFromRepo = await _repo.GetProduction(id);

            _mapper.Map(prodForUpdateDto, prodFromRepo);

            if (await _repo.SaveAll())
                return CreatedAtRoute("GetProd", new {id = prodFromRepo.Id}, prodForUpdateDto);

            throw new Exception($"Updating production lot {id} failed on save");
        }

        [HttpPut("{id}/inQuestion")]
        public async Task<IActionResult> UpdateProductionInQuestion(int id, ProdForQuestionDto prodForUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var prodFromRepo = await _repo.GetProduction(id);

            _mapper.Map(prodForUpdateDto, prodFromRepo);

            if (await _repo.SaveAll())
                return CreatedAtRoute("GetProd", new {id = prodFromRepo.Id}, prodForUpdateDto);

            throw new Exception($"Updating production lot {id} failed on save");
        }

        [HttpGet("{id}", Name = "GetProd")]
        public async Task<IActionResult> GetProduction(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            Production production = await _repo.GetProduction(id);
            ProdForReturnDto prodForReturn = _mapper.Map<ProdForReturnDto>(production);
            return Ok(prodForReturn);
        }


        [HttpGet]
        public async Task<IActionResult> GetProductionSet(int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            IEnumerable<Production> directProductions = await _repo.GetProductionSet(userId);

            var productionSet = _mapper.Map<IEnumerable<ProdForReturnDto>>(directProductions);

            return Ok(productionSet);
        }

        [HttpGet("machine={mach}")]
        public async Task<IActionResult> GetProductionSetByMachine(int userId, string mach)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            IEnumerable<Production> directProductions = await _repo.GetProductionSetByMachine(userId, mach);

            var productionSet = _mapper.Map<IEnumerable<ProdForReturnDto>>(directProductions);

            return Ok(productionSet);
        }

        [HttpGet("op={job}")]
        public async Task<IActionResult> GetProductionSetByJob(int userId, string job)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            IEnumerable<Production> directProductions = await _repo.GetProductionSetByJob(userId, job);

            var productionSet = _mapper.Map<IEnumerable<ProdForReturnDto>>(directProductions);

            return Ok(productionSet);
        }

        [HttpGet("job={job}&op={op}")]
        public async Task<IActionResult> GetProductionSetByOp(int userId, string job, string op)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            IEnumerable<Production> directProductions = await _repo.GetProductionSetByOp(userId, job, op);

            var productionSet = _mapper.Map<IEnumerable<ProdForReturnDto>>(directProductions);

            return Ok(productionSet);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduction(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var prodToDelete = await _repo.GetProduction(id);
            
            if (userId == int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                _repo.Delete(prodToDelete);
                await _repo.SaveAll();
                return Ok(
                            prodToDelete.Date.ToString("MM/dd/yyyy")
                            + " "
                            + prodToDelete.Shift
                            + " shift production for Op# " 
                            + prodToDelete.OpNumber 
                            +" running on the " 
                            + prodToDelete.Machine 
                            +" was deleted!"
                        );
        }
    }
}