using SafariSync_API.Models.ContractorModel;
using System.ComponentModel.DataAnnotations;

public class ScheduledTaskContractorViewModel
{
    [Required]
    public int ScheduledTask_ID { get; set; }

    [Required]
    public Contractor[] Contractors { get; set; } = Array.Empty<Contractor>();
}