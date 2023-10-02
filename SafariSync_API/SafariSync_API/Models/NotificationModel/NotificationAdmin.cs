using SafariSync_API.Models.ContractorModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models.NotificationModel
{
    public class NotificationAdmin
    {
        [Key]
        public int Notification_ID { get; set; }

        public DateTime Date { get; set; }

        public int ScheduledTask_ID { get; set; }

        [MaxLength(255)]
        public string Notification_Message { get; set; } = string.Empty;

        public int NotificationStatus_ID { get; set; }

        public int Contractor_ID { get; set; }

        [ForeignKey("NotificationStatus_ID")]
        public NotificationStatus? NotificationStatus { get; set; }

        [ForeignKey("ScheduledTask_ID")]
        public ScheduledTask? ScheduledTask { get; set; }

        [ForeignKey("Contractor_ID")]
        public Contractor? Contractor { get; set; }
    }
}