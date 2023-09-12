using SafariSync_API.Models.ActivityModel;
using SafariSync_API.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SafariSync_API.Models.SupplierModel;
using SafariSync_API.Models.UserModel;

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