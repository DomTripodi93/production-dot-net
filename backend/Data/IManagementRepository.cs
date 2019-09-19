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
        Task<Mach> GetMachine(int userId, string mach);
        Task<IEnumerable<Mach>> GetMachines(int userId);
        Task<IEnumerable<Mach>> GetMachinesByJob(int userId);
        Task<Part> GetPart(int userId, string part);
        Task<IEnumerable<Part>> GetParts(int userId);
        Task<Part> GetPartByJob(int userId, string job);
        Task<Job> GetJob(int userId, string jobNum);
        Task<IEnumerable<Job>> GetJobs(int userId);
        Task<IEnumerable<Job>> GetJobsByPart(int userId, string partNum);
        Task<Operation> GetOp(string jobNum, string opNum);
        Task<IEnumerable<Operation>> GetOpsByJob(string jobNum);
        Task<Production> GetProduction(int id);
        Task<IEnumerable<Production>> GetProductionSet(int userId);
        Task<IEnumerable<Production>> GetProductionSetByJob(int userId, string job);
        Task<IEnumerable<Production>> GetProductionSetByOp(int userId, string job, string Op);
        Task<IEnumerable<Production>> GetProductionSetByJobAndMachine(int userId, string job, string mach);
        Task<IEnumerable<Production>> GetProductionSetByMachine(int userId, string mach);
        Task<Hourly> GetHourly(int id);
        Task<IEnumerable<Hourly>> GetHourlySet(int userId);
        Task<IEnumerable<Hourly>> GetHourlySetByDateAndMachine(int userId, string date, string mach);
        Task<Settings> GetSettings(int userId);
        Task<StartTime> GetStartTime(int userId, string date, string machName, string shift);
        Task<StartTime> GetUniqueStartTime(int id);
        Task<IEnumerable<ChangeLog>> GetChangeLog(int userId, string model);
        Task<ChangeLog> GetUniqueChangeLog(int id);
    }
}