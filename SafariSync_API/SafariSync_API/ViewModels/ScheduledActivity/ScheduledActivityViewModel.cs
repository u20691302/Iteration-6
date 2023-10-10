using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.ViewModels.ScheduledActivity
{
    public class ScheduledActivityViewModel
    {
        public int ScheduledActivity_ID { get; set; }

        public DateTime StartDate { get; set; }

        
        public DateTime EndDate { get; set; }

        
        public string Activity_Location { get; set; } = string.Empty;

       
        public int User_ID { get; set; }

       
        public int ActivityStatus_ID { get; set; }

        
        public int Activity_ID { get; set; }
    }
}