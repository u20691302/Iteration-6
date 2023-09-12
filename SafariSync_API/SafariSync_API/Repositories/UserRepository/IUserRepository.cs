using SafariSync_API.Models.SkillsModel;
using SafariSync_API.Models.UserModel;

namespace SafariSync_API.Repositories.UserRepository
{
    public interface IUserRepository
    {
        Task<User?> GetUserByUsername(string username);

        Task<User?> GetUserByIdPassport(string idnum);

        Task CreateUser(User user);

        Task UpdateUser(User user);

        Task<List<User>> GetAllUsers();

        Task<User?> GetUserById(int id);

        Task RemoveUserSkills(int userId);

        Task<List<Skills>> GetSkillsByUserId(int userId);
    }
}