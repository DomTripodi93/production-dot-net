using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd.Models;

namespace BackEnd.Data
{
    public interface IManagementRepository
    {
        void Add<T>(T entity) where T: class;
        void Delete<T>(T entity) where T: class;
        Task<bool> SaveAll();
        Task<User> GetUser(int id);
        Task<Mach> GetMachine(int id);
        Task<IEnumerable<Mach>> GetMachines(int userId);
        Task<IEnumerable<Mach>> GetMachinesByJob(int userId);
        Task<Part> GetPart(int id);
        Task<IEnumerable<Part>> GetParts(int userId);
        Task<Part> GetPartByJob(int userId, string job);
        Task<Job> GetJob(int id);
        Task<IEnumerable<Job>> GetJobByNumber(int userId, string jobNum);
        Task<Job> GetJobByNumberAndOp(int userId, string jobNum, string Op);
        Task<IEnumerable<Job>> GetJobs(int userId);
        Task<IEnumerable<Job>> GetJobsByPart(int userId, string partNum);
        Task<Production> GetProduction(int id);
        Task<IEnumerable<Production>> GetProductionSet(int userId);
        Task<IEnumerable<Production>> GetProductionSetByJob(int userId, string job);
        Task<IEnumerable<Production>> GetProductionSetByJobAndMachine(int userId, string job, string mach);
        Task<IEnumerable<Production>> GetProductionSetByMachine(int userId, string mach);
        Task<Hourly> GetHourly(int id);
        Task<IEnumerable<Hourly>> GetHourlySet(int userId);
        Task<IEnumerable<Hourly>> GetHourlySetByDate(int userId, string date);
        Task<IEnumerable<Hourly>> GetHourlySetByJob(int userId, string job);
        Task<IEnumerable<Hourly>> GetHourlySetByJobAndMachine(int userId, string job, string mach);
        Task<Settings> GetSettings(int userId);
        Task<StartTime> GetStartTime(int userId, string date, int machId, string shift);
        Task<StartTime> GetUniqueStartTime(int id);
        Task<IEnumerable<ChangeLog>> GetChangeLog(int userId, string model);
        Task<ChangeLog> GetUniqueChangeLog(int id);
    }
}