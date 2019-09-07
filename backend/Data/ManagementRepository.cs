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

        public async Task<IEnumerable<Production>> GetProductionSetByJob(int userId, string job)
        {
            var user = await _context.Users
                .Include(x => x.Production)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            return user.Production.Where(p => p.userId == userId).Where(p => p.Job == job);
        }

        public async Task<IEnumerable<Production>> GetProductionSetByJobAndMachine(int userId, string job, string mach)
        {
            var user = await _context.Users
                .Include(x => x.Production)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            return user.Production.Where(p => p.userId == userId).Where(p => p.Job == job).Where(p => p.Machine == mach);
        }

        public async Task<IEnumerable<Production>> GetProductionSetByMachine(int userId, string mach)
        {
            var user = await _context.Users
                .Include(x => x.Production)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            return user.Production.Where(p => p.userId == userId).Where(p => p.Machine == mach);
        }

        public async Task<Part> GetPart(int id)
        {
            var machine = await _context.Parts.FirstOrDefaultAsync(p => p.Id == id);
            return machine;
        }

        public  async Task<IEnumerable<Part>> GetParts(int userId)
        {
            var user = await _context.Users
                .Include(x => x.Part)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            return user.Part.Where(p => p.userId == userId);
        }

        public async Task<IEnumerable<Part>> GetPartsByJob(int userId, string job)
        {
            var user = await _context.Users
                .Include(x => x.Part)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            return user.Part.Where(p => p.userId == userId).Where(p => p.Job == job);
        }

        public async Task<IEnumerable<Part>> GetPartsByPart(int userId, string part)
        {
            var user = await _context.Users
                .Include(x => x.Part)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            return user.Part.Where(p => p.userId == userId).Where(p => p.PartNumber == part);
        }

        public async Task<IEnumerable<Part>> GetPartsByMachine(int userId, string mach)
        {
            var user = await _context.Users
                .Include(x => x.Part)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            return user.Part.Where(p => p.userId == userId).Where(p => p.Machine == mach);
        }

        public Task<Production> GetHourly(int id)
        {
            throw new System.NotImplementedException();
        }

        public Task<IEnumerable<Production>> GetHourlySet(int userId)
        {
            throw new System.NotImplementedException();
        }

        public Task<IEnumerable<Production>> GetHourlySetByDate(int userId, string date)
        {
            throw new System.NotImplementedException();
        }

        public Task<IEnumerable<Production>> GetHourlySetByJob(int userId, string job)
        {
            throw new System.NotImplementedException();
        }

        public Task<IEnumerable<Production>> GetHourlySetByJobAndMachine(int userId, string job, string mach)
        {
            throw new System.NotImplementedException();
        }
    }
}