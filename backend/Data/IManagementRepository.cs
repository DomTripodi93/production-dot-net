using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Dtos;
using BackEnd.Models;

namespace backend.Data
{
    public interface IManagementRepository
    {
         void Add<T>(T entity) where T: class;
         void Delete<T>(T entity) where T: class;
         Task<bool> SaveAll();
         Task<User> GetUser(int id);
         Task<Mach> GetMachine(int id);
         Task<IEnumerable<Mach>> GetMachines(int userId);
         Task<Part> GetPart(int id);
         Task<IEnumerable<Part>> GetParts(int userId);
         Task<IEnumerable<Part>> GetPartsByJob(int userId, string job);
         Task<IEnumerable<Part>> GetPartsByPart(int userId, string part);
         Task<IEnumerable<Part>> GetPartsByMachine(int userId, string mach);
         Task<Production> GetProduction(int id);
         Task<IEnumerable<Production>> GetProductionSet(int userId);
         Task<IEnumerable<Production>> GetProductionSetByJob(int userId, string job);
         Task<IEnumerable<Production>> GetProductionSetByJobAndMachine(int userId, string job, string mach);
         Task<IEnumerable<Production>> GetProductionSetByMachine(int userId, string mach);
         Task<Production> GetHourly(int id);
         Task<IEnumerable<Production>> GetHourlySet(int userId);
         Task<IEnumerable<Production>> GetHourlySetByDate(int userId, string date);
         Task<IEnumerable<Production>> GetHourlySetByJob(int userId, string job);
         Task<IEnumerable<Production>> GetHourlySetByJobAndMachine(int userId, string job, string mach);
    }
}