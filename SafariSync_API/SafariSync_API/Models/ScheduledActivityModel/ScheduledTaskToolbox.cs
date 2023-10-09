using SafariSync_API.Models.ToolboxModel;
using SafariSync_API.Models.UserModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models
{
    public class ScheduledTaskToolbox
    {
        [Key]
        public int ScheduledTaskToolbox_ID { get; set; }

        [Required]
        public int Toolbox_ID { get; set; }

        [Required]
        public int ScheduledTask_ID { get; set; }

        [ForeignKey("Toolbox_ID")]
        public Toolbox? Toolbox { get; set; }
    }
}