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
        Task<IEnumerable<Mach>> GetAllMachines(int userId);
        Task<IEnumerable<Mach>> GetMachines(int userId, string machType);
        Task<IEnumerable<Mach>> GetMachinesByJob(int userId);
        Task<Part> GetPart(int userId, string part);
        Task<IEnumerable<Part>> GetPartsByNumber(int userId, string part);
        Task<IEnumerable<Part>> GetAnyParts(int userId);
        Task<IEnumerable<Part>> GetParts(int userId, string machType);
        Task<IEnumerable<Part>> GetAllParts(int userId, string machType);
        Task<Part> GetPartByJob(int userId, string job);
        Task<Job> GetJob(int userId, string jobNum);
        Task<IEnumerable<Job>> GetAnyJobs(int userId);
        Task<PagedList<Job>> GetJobs(int userId, PagingParams jobParams, string machType);
        Task<PagedList<Job>> GetAllJobsByType(int userId, PagingParams jobParams, string machType);
        Task<IEnumerable<Job>> GetJobsByPart(int userId, string partNumber);
        Task<Operation> GetOp(int userId, string jobNum, string opNum);
        Task<IEnumerable<Operation>> GetOpsByJob(int userId, string jobNum);
        Task<IEnumerable<Operation>> GetOpsByMach(int userId, string jobNum,  string mach);
        Task<Production> GetProduction(int id);
        Task<IEnumerable<Production>> GetAnyProduction(int userId);
        Task<PagedList<Production>> GetProductionSet(int userId, PagingParams prodParams, string machType);
        Task<IEnumerable<Production>> GetProductionSetByJob(int userId, string job);
        Task<IEnumerable<Production>> GetProductionSetByOp(int userId, string job, string Op);
        Task<IEnumerable<Production>> GetProductionSetByJobOpAndMachine(int userId, string job, string op, string mach);
        Task<IEnumerable<Production>> GetProductionSetByDate(int userId, string date);
        Task<IEnumerable<Production>> GetProductionSetByMachineAndDate(int userId, string date, string mach);
        Task<Hourly> GetAnyHourly(int userId);
        Task<Hourly> GetHourly(int id);
        Task<IEnumerable<Hourly>> GetHourlySetByDateAndMachine(int userId, string date, string mach);
    }
}