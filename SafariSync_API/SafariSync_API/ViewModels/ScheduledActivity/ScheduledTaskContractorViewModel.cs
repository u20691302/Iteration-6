using SafariSync_API.Models.ContractorModel;
using SafariSync_API.Models.SupplierModel;
using SafariSync_API.Models.UserModel;
using System.ComponentModel.DataAnnotations;

public class ScheduledTaskContractorViewModel
{
    [Required]
    public int ScheduledTask_ID { get; set; }

    [Required]
    public Contractor[] Contractors { get; set; } = Array.Empty<Contractor>();
}
