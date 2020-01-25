using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BackEnd.Data;
using BackEnd.Helpers;
using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        
        public UserRepository(DataContext context, IMapper mapper)
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

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<Settings> GetSettings(int userId)
        {
            var user = await _context.Users
                .Include(x => x.Settings)
                .FirstOrDefaultAsync(u => u.Id == userId);

            return user.Settings;
        }

        public async Task<PagedList<ChangeLog>> GetChangeLog(int userId, string model, PagingParams changeLogParams)
        {
            var changes = _context.ChangeLogs
                .Where(m => m.userId == userId)
                .Where(c => c.ChangedModel == model)
                .OrderByDescending(c => c.TimeStamp);

            return await PagedList<ChangeLog>.CreateAsync(changes, changeLogParams.PageNumber, changeLogParams.PageSize);
        }

        public async Task<ChangeLog> GetUniqueChangeLog(int id)
        {
            var changes = await _context.ChangeLogs
                .FirstOrDefaultAsync(c => c.Id == id);

            return changes;
        }
    }
}