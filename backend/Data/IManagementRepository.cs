using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd.Helpers;
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
        Task<PagedList<Job>> GetJobs(int userId, PagingParams jobParams);
        Task<IEnumerable<Job>> GetJobsByPart(int userId, string partNum);
        Task<Operation> GetOp(int userId, string jobNum, string opNum);
        Task<IEnumerable<Operation>> GetOpsByJob(int userId, string jobNum);
        Task<Production> GetProduction(int id);
        Task<PagedList<Production>> GetProductionSet(int userId, PagingParams prodParams);
        Task<IEnumerable<Production>> GetProductionSetByJob(int userId, string job);
        Task<IEnumerable<Production>> GetProductionSetByOp(int userId, string job, string Op);
        Task<IEnumerable<Production>> GetProductionSetByJobAndMachine(int userId, string job, string mach);
        Task<IEnumerable<Production>> GetProductionSetByMachine(int userId, string mach);
        Task<IEnumerable<Production>> GetProductionSetByDate(int userId, string date);
        Task<Hourly> GetAnyHourly(int userId);
        Task<Hourly> GetHourly(int id);
        Task<IEnumerable<Hourly>> GetHourlySetByDateAndMachine(int userId, string date, string mach);
        Task<Settings> GetSettings(int userId);
        Task<PagedList<ChangeLog>> GetChangeLog(int userId, string model, PagingParams changeLogParams);
        Task<ChangeLog> GetUniqueChangeLog(int id);
    }
}