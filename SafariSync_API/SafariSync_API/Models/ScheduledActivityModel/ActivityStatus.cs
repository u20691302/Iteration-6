using System.ComponentModel.DataAnnotations;

public class ActivityStatus
{
    [Key]
    public int ActivityStatus_ID { get; set; }

    [Required]
    public string Activity_Status { get; set; } = string.Empty;
}