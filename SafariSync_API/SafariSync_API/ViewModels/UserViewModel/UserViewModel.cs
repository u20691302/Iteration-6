using SafariSync_API.Models.SkillsModel;

namespace SafariSync_API.ViewModels.UserViewModel
{
    public class UserViewModel
    {
        public int User_ID { get; set; }
        public string Username { get; set; } = string.Empty;

        public string Surname { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string IdPassport { get; set; } = string.Empty;

        public string Cellphone { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string Role { get; set; } = string.Empty;

        public string ProfileImage { get; set; } = string.Empty;

        public string IDImage { get; set; } = string.Empty;

        public Skills[] Skills { get; set; } = Array.Empty<Skills>();

        public int Rating_ID { get; set; }
    }
}