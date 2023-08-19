using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ScheduledActivityScheduledTask
{
    [Key]
    public int ScheduledActivityScheduledTask_ID { get; set; }

    [Required]
    public int ScheduledActivity_ID { get; set; }

    [Required]
    public int ScheduledTask_ID { get; set; }

    [ForeignKey("ScheduledTask_ID")]
    public ScheduledTask? ScheduledTask { get; set; }
}