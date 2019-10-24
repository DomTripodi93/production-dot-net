using System.Threading.Tasks;
using BackEnd.Helpers;
using BackEnd.Models;

namespace BackEnd.Data
{
    public interface IUserRepository
    {
        void Add<T>(T entity) where T: class;
        void Delete<T>(T entity) where T: class;
        Task<bool> SaveAll();
        Task<User> GetUser(int id);
        Task<Settings> GetSettings(int userId);
        Task<PagedList<ChangeLog>> GetChangeLog(int userId, string model, PagingParams changeLogParams);
        Task<ChangeLog> GetUniqueChangeLog(int id);
        
    }
}