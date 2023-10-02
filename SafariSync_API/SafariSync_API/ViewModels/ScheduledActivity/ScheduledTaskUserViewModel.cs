using SafariSync_API.Models.UserModel;
using System.ComponentModel.DataAnnotations;

public class ScheduledTaskUserViewModel
{
    [Required]
    public int ScheduledTask_ID { get; set; }

    [Required]
    public User[] Users { get; set; } = Array.Empty<User>();
}