using SafariSync_API.Models;
using SafariSync_API.Models.ActivityModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ScheduledTask
{
    [Key]
    public int ScheduledTask_ID { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Required]
    public string TaskStatus { get; set; } = string.Empty;

    [Required]
    public int Task_ID { get; set; }

    [ForeignKey("Task_ID")]
    public TaskS? Task { get; set; }

    [ForeignKey("ScheduledTask_ID")]
    public ICollection<ScheduledTaskUser> ScheduledTaskUser { get; set; } = new List<ScheduledTaskUser>();
}