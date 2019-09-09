using System.Threading.Tasks;
using AutoMapper;
using BackEnd.Data;
using BackEnd.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IManagementRepository _repo;
        public UserController(IMapper mapper, IManagementRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            var returnUser = _mapper.Map<UserForReturnDto>(user);
            return Ok(returnUser);
        }
        
    }
}