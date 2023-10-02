using SafariSync_API.Models.UserModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models.NotificationModel
{
    public class NotificationSupervisor
    {
        [Key]
        public int Notification_ID { get; set; }

        public DateTime Date { get; set; }

        public int User_ID { get; set; }

        [MaxLength(255)]
        public string Notification_Message { get; set; } = string.Empty;

        public int NotificationStatus_ID { get; set; }

        public int ScheduledActivity_ID { get; set; }

        [ForeignKey("NotificationStatus_ID")]
        public NotificationStatus? NotificationStatus { get; set; }

        [ForeignKey("ScheduledActivity_ID")]
        public ScheduledActivity? ScheduledActivity { get; set; }

        [ForeignKey("User_ID")]
        public User? User { get; set; }
    }
}