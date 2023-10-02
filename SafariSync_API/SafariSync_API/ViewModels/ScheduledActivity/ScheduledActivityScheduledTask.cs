using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.ViewModels.ScheduledActivity
{
    public class ScheduledActivityScheduledTaskViewModel
    {
        [Required]
        public int ScheduledActivity_ID { get; set; }

        [Required]
        public int ScheduledTask_ID { get; set; }
    }
}