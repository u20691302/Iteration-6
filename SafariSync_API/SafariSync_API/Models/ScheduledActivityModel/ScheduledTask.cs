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
    public int TaskStatus_ID { get; set; }

    [Required]
    public int Task_ID { get; set; }

    [ForeignKey("TaskStatus_ID")]
    public TaskStatus? TaskStatus { get; set; }

    [ForeignKey("Task_ID")]
    public TaskS? Task { get; set; }

    [ForeignKey("ScheduledTask_ID")]
    public ICollection<ScheduledTaskUser> ScheduledTaskUser { get; set; } = new List<ScheduledTaskUser>();

    [ForeignKey("ScheduledTask_ID")]
    public ICollection<ScheduledTaskContractor> ScheduledTaskContractor { get; set; } = new List<ScheduledTaskContractor>();
}