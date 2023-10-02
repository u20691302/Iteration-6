using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.ViewModels.ScheduledActivity
{
    public class ScheduledActivityViewModel
    {
        public int ScheduledActivity_ID { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public string Activity_Location { get; set; } = string.Empty;

        [Required]
        public int User_ID { get; set; }

        [Required]
        public int ActivityStatus_ID { get; set; }

        [Required]
        public int Activity_ID { get; set; }
    }
}