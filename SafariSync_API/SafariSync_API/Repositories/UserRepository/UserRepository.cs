using Microsoft.EntityFrameworkCore;
using SafariSync_API.Data;
using SafariSync_API.Models.SkillsModel;
using SafariSync_API.Models.UserModel;

namespace SafariSync_API.Repositories.UserRepository
{
    public class UserRepository : IUserRepository
    {
        private readonly SafariSyncDBContext _dbContext;

        public UserRepository(SafariSyncDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<User?> GetUserByUsername(string username)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<User?> GetUserByIdPassport(string idnum)
        {
            return await _dbContext.Users
                .Include(u => u.Ratings) // Include the Ratings navigation property
                .FirstOrDefaultAsync(u => u.IdPassport == idnum);
        }

        public async Task<List<User>> GetAllUsers()
        {
            return await _dbContext.Users.ToListAsync();
        }

        public async Task CreateUser(User user)
        {
            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateUser(User user)
        {
            _dbContext.Users.Update(user);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<User?> GetUserById(int id)
        {
            return await _dbContext.Users.FindAsync(id);
        }

        public async Task RemoveUserSkills(int userId)
        {
            try
            {
                // Implement the logic to remove the user's skills from the database
                // For example:
                var userSkills = _dbContext.UserSkill.Where(us => us.User_ID == userId);
                _dbContext.UserSkill.RemoveRange(userSkills);

                // Save the changes to the database
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Handle any exceptions that may occur during the removal process
                // You can log the error, throw a custom exception, or handle it as per your application's requirements.
                throw new Exception("Error removing user skills.", ex);
            }
        }

        public async Task<List<Skills>> GetSkillsByUserId(int userId)
        {
            try
            {
                // Implement the logic to get the skills associated with the user from the database
                // For example:
                var userSkills = await _dbContext.UserSkill
                    .Where(us => us.User_ID == userId)
                    .Select(us => us.Skills)
                    .ToListAsync();

                return userSkills!;
            }
            catch (Exception ex)
            {
                // Handle any exceptions that may occur during the retrieval process
                // You can log the error, throw a custom exception, or handle it as per your application's requirements.
                throw new Exception("Error getting user skills.", ex);
            }
        }
    }
}