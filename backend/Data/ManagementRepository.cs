using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Data
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

        public async Task<Mach> GetMachine(int userId, string mach)
        {
            var machine = await _context.Machines
                .Where(m => m.userId == userId)
                .FirstOrDefaultAsync(m => m.Machine == mach);
            return machine;
        }

        public async Task<IEnumerable<Mach>> GetMachines(int userId)
        {
            var user = await _context.Users
                .Include(x => x.Machine)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            return user.Machine;
        }

        public async Task<IEnumerable<Mach>> GetMachinesByJob(int userId)
        {
            var user = await _context.Users
                .Include(x => x.Machine)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            return user.Machine.OrderByDescending(m => m.CurrentJob);
        }

        public async Task<Part> GetPart(int userId, string part)
        {
            var partToReturn = await _context.Parts
                .Where(p => p.userId == userId)
                .FirstOrDefaultAsync(p => p.PartNumber == part);

            return partToReturn;
        }

        public  async Task<IEnumerable<Part>> GetParts(int userId)
        {
            var parts = await _context.Parts
                .Where(p => p.userId == userId)
                .ToListAsync();
                
            return parts;
        }

        public async Task<Part> GetPartByJob(int userId, string jobNum)
        {
            var job = await _context.Jobs
                .FirstOrDefaultAsync(j => j.JobNumber == jobNum);

            var parts = await _context.Parts
                .FirstOrDefaultAsync(p => p.PartNumber == job.PartNum);
                
            return parts;
        }

        public async Task<Job> GetJob(int userId, string jobNum)
        {

            var job = await _context.Jobs        
                .Where(j => j.userId == userId)
                .FirstOrDefaultAsync(j => j.JobNumber == jobNum);

            return job;
        }

        public async Task<IEnumerable<Job>> GetJobs(int userId)
        {
            var jobs = await _context.Jobs
                .Include(x => x.Operation)
                .Where(j => j.userId == userId)
                .ToListAsync();

            return jobs.OrderByDescending(j => j.JobNumber);
        }

        public async Task<IEnumerable<Job>> GetJobsByPart(int userId, string partNum)
        {
            var jobs = await _context.Jobs
                .Include(x => x.Operation)
                .Where(j => j.userId == userId)
                .Where(p => p.PartNum == partNum)
                .ToListAsync();

            return jobs;
        }

        public async Task<Operation> GetOp(string jobNum, string opNum)
        {
            var operation = await _context.Operations
                .Include(x => x.Production)
                .Where(o => o.JobNumber == jobNum)
                .FirstOrDefaultAsync(o => o.OpNumber == opNum);

            return operation;
        }

        public async Task<IEnumerable<Operation>> GetOpsByJob(string jobNum)
        {
            var operations = await _context.Operations
                .Include(x => x.Production)
                .Where(o => o.JobNumber == jobNum)
                .ToListAsync();

            return operations;
        }

        public async Task<Production> GetProduction(int id)
        {
            var production = await _context.Production.FirstOrDefaultAsync(p => p.Id == id);
            return production;
        }

        public async Task<IEnumerable<Production>> GetProductionSet(int userId)
        {
            var prodForReturn = await _context.Production
                .Where(p => p.userId == userId)
                .ToListAsync();

            return prodForReturn;
        }

        public async Task<IEnumerable<Production>> GetProductionSetByJob(int userId, string job)
        {
            var prodForReturn = await _context.Production
                .Where(o => o.userId == userId)
                .Where(o => o.JobNumber == job)
                .ToListAsync();

            return prodForReturn;
        }

        public async Task<IEnumerable<Production>> GetProductionSetByOp(int userId, string job, string op)
        {
            var prodForReturn = await _context.Production
                .Where(o => o.userId == userId)
                .Where(o => o.JobNumber == job)
                .Where(o => o.OpNumber == op)
                .ToListAsync();

            return prodForReturn;
        }

        public async Task<IEnumerable<Production>> GetProductionSetByJobAndMachine(int userId, string job, string mach)
        {
            var prodForReturn = await _context.Production
                .Where(j => j.userId == userId)
                .Where(p => p.JobNumber == job)
                .Where(p => p.Machine == mach)
                .ToListAsync();

            return prodForReturn;
        }

        public async Task<IEnumerable<Production>> GetProductionSetByMachine(int userId, string mach)
        {
            var prodForReturn = await _context.Production
                .Where(j => j.userId == userId)
                .Where(p => p.Machine == mach)
                .ToListAsync();

            return prodForReturn;
        }

        public async Task<Hourly> GetHourly(int id)
        {
            var hourly = await _context.Hourlys.FirstOrDefaultAsync(p => p.Id == id);
            return hourly;
        }

        public async Task<IEnumerable<Hourly>> GetHourlySet(int userId)
        {
            var hourlyForReturn = await _context.Hourlys
                .Where(j => j.userId == userId)
                .ToListAsync();

            return hourlyForReturn;
        }

        public async Task<IEnumerable<Hourly>> GetHourlySetByDateAndMachine(int userId, string date, string mach)
        {

            DateTime dateAsDate = DateTime.Parse(date);

            var hourlyForReturn = await _context.Hourlys
                .Where(j => j.userId == userId)
                .Where(p => p.Date.Date == dateAsDate.Date)
                .Where(p => p.Machine == mach)
                .ToListAsync();

            return hourlyForReturn;
        }

        public async Task<Settings> GetSettings(int userId)
        {
            var user = await _context.Users
                .Include(x => x.Settings)
                .FirstOrDefaultAsync(u => u.Id == userId);

            return user.Settings;
        }

        public async Task<StartTime> GetStartTime(int userId, string date, string machName, string shift)
        {
            var starts = await _context.StartTimes
                .Where(s => s.Machine == machName)
                .Where(s => s.Date.ToString().Substring(0,9) == date)
                .FirstOrDefaultAsync(s => s.Shift == shift);

            return starts;
        }

        public async Task<StartTime> GetUniqueStartTime(int id)
        {
            var startTime = await _context.StartTimes
                .FirstOrDefaultAsync(m => m.Id == id);
            return startTime;
        }

        public async Task<IEnumerable<ChangeLog>> GetChangeLog(int userId, string model)
        {
            var changes = await _context.ChangeLogs
                .Where(c => c.ChangedModel == model)
                .ToListAsync();

            return changes;
        }

        public async Task<ChangeLog> GetUniqueChangeLog(int id)
        {
            var changes = await _context.ChangeLogs
                .FirstOrDefaultAsync(c => c.Id == id);

            return changes;
        }
    }
}