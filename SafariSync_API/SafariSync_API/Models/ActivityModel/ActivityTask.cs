using SafariSync_API.Models.ActivityModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models.EquipmentModel
{
    public class ActivityTask
    {
        [Key]
        public int ActivityTask_ID { get; set; }

        [Required]
        public int Activity_ID { get; set; }

        [Required]
        public int Task_ID { get; set; }

        [ForeignKey("Task_ID")]
        public TaskS? Task { get; set; }
    }
}