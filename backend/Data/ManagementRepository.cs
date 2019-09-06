using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using backend.Dtos;
using BackEnd.Data;
using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ManagementRepository : IManagementRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        
        public ManagementRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Mach> GetMachine(int id)
        {
            var machine = await _context.Machines.FirstOrDefaultAsync(m => m.Id == id);
            return machine;
        }

        public async Task<IEnumerable<Mach>> GetMachines(int userId)
        {
            var user = await _context.Users
                .Include(x => x.Machine)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            return user.Machine.Where(m => m.userId == userId);
        }

        public async Task<Production> GetProduction(int id)
        {
            var production = await _context.Production.FirstOrDefaultAsync(p => p.Id == id);
            return production;
        }

        public async Task<IEnumerable<Production>> GetProductionSet(int userId)
        {
            var user = await _context.Users
                .Include(x => x.Production)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            return user.Production.Where(p => p.userId == userId);
        }

        public async Task<IEnumerable<Production>> GetProductionSetByMachine(int userId, string mach)
        {
            var user = await _context.Users
                .Include(x => x.Production)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            return user.Production.Where(p => p.userId == userId).Where(p => p.Machine == mach);
        }

        public async Task<IEnumerable<Production>> GetProductionSetByJob(int userId, string job)
        {
            var user = await _context.Users
                .Include(x => x.Production)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            return user.Production.Where(p => p.userId == userId).Where(p => p.Job == job);
        }
    }
}