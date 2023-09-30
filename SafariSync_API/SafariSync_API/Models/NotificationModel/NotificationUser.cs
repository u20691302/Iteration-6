﻿using SafariSync_API.Models.UserModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.Models.NotificationModel
{
    public class NotificationUser
    {
        [Key]
        public int Notification_ID { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public int User_ID { get; set; }

        [Required]
        [MaxLength(255)]
        public string Notification_Message { get; set; } = string.Empty;

        [Required]
        public int NotificationStatus_ID { get; set; }

        [Required]
        public int ScheduledTask_ID { get; set; }

        [ForeignKey("NotificationStatus_ID")]
        public NotificationStatus? NotificationStatus { get; set; }

        [ForeignKey("ScheduledTask_ID")]
        public ScheduledTask? ScheduledTask { get; set; }

        [ForeignKey("User_ID")]
        public User? User { get; set; }

    }
}
