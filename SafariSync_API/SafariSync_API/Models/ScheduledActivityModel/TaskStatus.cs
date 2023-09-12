using System.ComponentModel.DataAnnotations;

public class TaskStatus
{
    [Key]
    public int TaskStatus_ID { get; set; }

    [Required]
    public string Task_Status { get; set; } = string.Empty;
}