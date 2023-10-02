using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.Models.NotificationModel
{
    public class NotificationStatus
    {
        [Key]
        public int NotificationStatus_ID { get; set; }

        [Required]
        public string NotificationStatus_Name { get; set; } = string.Empty;
    }
}