using SafariSync_API.Models.ActivityModel;
using SafariSync_API.Models.UserModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ScheduledActivity
{
    [Key]
    public int ScheduledActivity_ID { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Required]
    public string Activity_Location { get; set; } = string.Empty;

    [Required]
    public int User_ID { get; set; }

    [Required]
    public int ActivityStatus_ID { get; set; }

    [Required]
    public int Activity_ID { get; set; }

    [ForeignKey("User_ID")]
    public User? Users { get; set; }

    [ForeignKey("ActivityStatus_ID")]
    public ActivityStatus? ActivityStatus { get; set; }

    [ForeignKey("Activity_ID")]
    public Activity? Activity { get; set; }

    [ForeignKey("ScheduledActivity_ID")]
    public ICollection<ScheduledActivityScheduledTask> ScheduledActivityScheduledTask { get; set; } = new List<ScheduledActivityScheduledTask>();
}