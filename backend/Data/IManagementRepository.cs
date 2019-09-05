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
    }
}