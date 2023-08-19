using SafariSync_API.Models.SkillsModel;
using SafariSync_API.Models.SupplierModel;
using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.ViewModels.UserViewModel
{
    public class UserViewModel
    {
        //public int UserId { get; set; }

        public string Username { get; set; } = string.Empty;

        public string Surname { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        [Required]
        public string IdPassport { get; set; } = string.Empty;

        public string Cellphone { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
        
        public string Role { get; set; } = string.Empty;

        public string ProfileImage { get; set; } = string.Empty;

        public string IDImage { get; set; } = string.Empty;

        public Skills[] Skills { get; set; } = Array.Empty<Skills>();

        public int Rating_ID { get; set; }
    }
}