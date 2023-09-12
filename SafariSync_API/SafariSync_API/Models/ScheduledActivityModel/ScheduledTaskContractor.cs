using SafariSync_API.Models.ContractorModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models
{
    public class ScheduledTaskContractor
    {
        [Key]
        public int ScheduledTaskContractor_ID { get; set; }

        [Required]
        public int Contractor_ID { get; set; }

        [Required]
        public int ScheduledTask_ID { get; set; }

        [ForeignKey("Contractor_ID")]
        public Contractor? Contractor { get; set; }
    }
}