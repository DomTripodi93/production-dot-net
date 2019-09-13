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

        public async Task<Mach> GetMachine(int id)
        {
            var machine = await _context.Machines
                .FirstOrDefaultAsync(m => m.Id == id);
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

        public async Task<Part> GetPart(int id)
        {
            var part = await _context.Parts.FirstOrDefaultAsync(p => p.Id == id);
            return part;
        }

        public  async Task<IEnumerable<Part>> GetParts(int userId)
        {
            var user = await _context.Users
                .Include(x => x.Part)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            return user.Part;
        }

        public async Task<Part> GetPartByJob(int userId, string jobNum)
        {
            var job = await _context.Jobs
                .FirstOrDefaultAsync(j => j.JobNumber == jobNum);

            var parts = await _context.Parts
                .Include(x => x.Jobs)
                .FirstOrDefaultAsync(p => p.PartNumber == job.PartNum);
                
            return parts;
        }

        public async Task<IEnumerable<Part>> GetPartsByPart(int userId, string part)
        {
            var user = await _context.Users
                .Include(x => x.Part)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            return user.Part.Where(p => p.PartNumber == part);
        }

        public async Task<Job> GetJob(int id)
        {
            var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == id);
            return job;
        }

        public async Task<IEnumerable<Job>> GetJobs(int userId)
        {
            var jobs = await _context.Jobs
                .Include(x => x.Operation)
                .Where(j => j.userId == userId)
                .ToListAsync();

            return jobs;
        }

        public async Task<IEnumerable<Job>> GetJobsByPart(int userId, string partNum)
        {
            var part = await _context.Parts
                .Include(x => x.Jobs)
                .Where(j => j.userId == userId)
                .FirstOrDefaultAsync(p => p.PartNumber == partNum);

            Job[] prodSet = Array.Empty<Job>();
   
            foreach (Job job in part.Jobs)
            {
                prodSet.Append<Job>(job);
            }
            
            IEnumerable<Job> prodForReturn = prodSet;

            return prodForReturn;
        }

        public async Task<IEnumerable<Job>> GetJobByNumber(int userId, string jobNum)
        {
            var jobs = await _context.Jobs
                .Include(x => x.Operation)
                .Where(j => j.userId == userId)
                .Where(j => j.JobNumber == jobNum)
                .ToListAsync();

            return jobs;
        }

        public async Task<Operation> GetOp(int id)
        {
            var op = await _context.Operations.FirstOrDefaultAsync(p => p.Id == id);
            return op;
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
            var operations = await _context.Operations
                .Include(x => x.Production)
                .Where(o => o.userId == userId)
                .ToListAsync();

            Production[] prodSet = Array.Empty<Production>();
   
            foreach (Operation opSet in operations)
            {
                foreach (Production prod in opSet.Production)
                prodSet.Append<Production>(prod);
            }
            
            IEnumerable<Production> prodForReturn = prodSet;

            return prodForReturn;
        }

        public async Task<IEnumerable<Production>> GetProductionSetByJob(int userId, string job)
        {
            var operations = await _context.Operations
                .Include(x => x.Production)
                .Where(o => o.userId == userId)
                .Where(o => o.JobNumber == job)
                .ToListAsync();

            Production[] prodSet = Array.Empty<Production>();
   
            foreach (Operation opSet in operations)
            {
                foreach (Production prod in opSet.Production)
                prodSet.Append<Production>(prod);
            }
            
            IEnumerable<Production> prodForReturn = prodSet;

            return prodForReturn.Where(p => p.JobNumber == job);
        }

        public async Task<IEnumerable<Production>> GetProductionSetByOp(int userId, string job, string op)
        {
            var operations = await _context.Operations
                .Include(x => x.Production)
                .Where(o => o.userId == userId)
                .Where(o => o.JobNumber == job)
                .Where(o => o.Op == op)
                .ToListAsync();

            Production[] prodSet = Array.Empty<Production>();
   
            foreach (Operation opSet in operations)
            {
                foreach (Production prod in opSet.Production)
                prodSet.Append<Production>(prod);
            }
            
            IEnumerable<Production> prodForReturn = prodSet;

            return prodForReturn.Where(p => p.JobNumber == job);
        }

        public async Task<IEnumerable<Production>> GetProductionSetByJobAndMachine(int userId, string job, string mach)
        {
            var operations = await _context.Operations
                .Include(x => x.Production)
                .Where(j => j.userId == userId)
                .ToListAsync();

            Production[] prodSet = Array.Empty<Production>();
   
            foreach (Operation opSet in operations)
            {
                foreach (Production prod in opSet.Production)
                prodSet.Append<Production>(prod);
            }
            
            IEnumerable<Production> prodForReturn = prodSet;

            return prodForReturn.Where(p => p.JobNumber == job).Where(p => p.Machine == mach);
        }

        public async Task<IEnumerable<Production>> GetProductionSetByMachine(int userId, string mach)
        {
            var operations = await _context.Operations
                .Include(x => x.Production)
                .Where(j => j.userId == userId)
                .ToListAsync();

            Production[] prodSet = Array.Empty<Production>();
   
            foreach (Operation opSet in operations)
            {
                foreach (Production prod in opSet.Production)
                prodSet.Append<Production>(prod);
            }
            
            IEnumerable<Production> prodForReturn = prodSet;

            return prodForReturn.Where(p => p.Machine == mach);
        }

        public async Task<Hourly> GetHourly(int id)
        {
            var hourly = await _context.Hourlys.FirstOrDefaultAsync(p => p.Id == id);
            return hourly;
        }

        public async Task<IEnumerable<Hourly>> GetHourlySet(int userId)
        {
            var operations = await _context.Operations
                .Include(x => x.Hourly)
                .Where(j => j.userId == userId)
                .ToListAsync();

            Hourly[] hourlySet = Array.Empty<Hourly>();
   
            foreach (Operation opSet in operations)
            {
                foreach (Hourly hourly in opSet.Hourly)
                hourlySet.Append<Hourly>(hourly);
            }
            
            IEnumerable<Hourly> hourlyForReturn = hourlySet;

            return hourlyForReturn;
        }

        public async Task<IEnumerable<Hourly>> GetHourlySetByDate(int userId, string date)
        {
            var operations = await _context.Operations
                .Include(x => x.Hourly)
                .Where(j => j.userId == userId)
                .ToListAsync();

            Hourly[] hourlySet = Array.Empty<Hourly>();
   
            foreach (Operation opSet in operations)
            {
                foreach (Hourly hourly in opSet.Hourly)
                hourlySet.Append<Hourly>(hourly);
            }
            
            IEnumerable<Hourly> hourlyForReturn = hourlySet;

            DateTime dateAsDate = DateTime.Parse(date);

            return hourlyForReturn.Where(p => p.Time.Date == dateAsDate.Date);
        }

        public async Task<IEnumerable<Hourly>> GetHourlySetByJob(int userId, string job)
        {
            var operations = await _context.Operations
                .Include(x => x.Hourly)
                .Where(j => j.userId == userId)
                .FirstOrDefaultAsync(j => j.JobNumber == job);

            Hourly[] hourlySet = Array.Empty<Hourly>();
   
            foreach (Hourly hourly in operations.Hourly)
            hourlySet.Append<Hourly>(hourly);
            
            IEnumerable<Hourly> hourlyForReturn = hourlySet;

            return hourlyForReturn;
        }

        public async Task<IEnumerable<Hourly>> GetHourlySetByJobAndMachine(int userId, string job, string mach)
        {
            var operations = await _context.Operations
                .Include(x => x.Hourly)
                .Where(j => j.userId == userId)
                .ToListAsync();

            Hourly[] hourlySet = Array.Empty<Hourly>();
   
            foreach (Operation opSet in operations)
            {
                foreach (Hourly hourly in opSet.Hourly)
                hourlySet.Append<Hourly>(hourly);
            }
            
            IEnumerable<Hourly> hourlyForReturn = hourlySet;

            return hourlyForReturn.Where(p => p.JobNumber == job).Where(p => p.Machine == mach);
        }

        public async Task<Settings> GetSettings(int userId)
        {
            var user = await _context.Users
                .Include(x => x.Settings)
                .FirstOrDefaultAsync(u => u.Id == userId);

            return user.Settings;
        }

        public async Task<StartTime> GetStartTime(int userId, string date, int machId, string shift)
        {
            var starts = await _context.StartTimes
                .Where(s => s.MachId == machId)
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