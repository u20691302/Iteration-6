using SafariSync_API.Models.UserModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models
{
    public class ScheduledTaskUser
    {
        [Key]
        public int ScheduledTaskUser_ID { get; set; }

        [Required]
        public int User_ID { get; set; }

        [Required]
        public int ScheduledTask_ID { get; set; }

        [ForeignKey("User_ID")]
        public User? User { get; set; }
    }
}