using SafariSync_API.Models.EquipmentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models.ActivityModel
{
    public class Activity
    {
        [Key]
        public int Activity_ID { get; set; }

        [Required]
        public string Activity_Name { get; set; } = string.Empty;

        [Required]
        public string Activity_Description { get; set; } = string.Empty;

        [ForeignKey("Activity_ID")]
        public ICollection<ActivityTask> ActivityTask { get; set; } = new List<ActivityTask>();
    }
}