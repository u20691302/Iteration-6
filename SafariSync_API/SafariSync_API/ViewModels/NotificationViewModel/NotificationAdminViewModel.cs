namespace SafariSync_API.ViewModels.NotificationViewModel
{
    public class NotificationAdminViewModel
    {
        public int Notification_ID { get; set; }
        public DateTime Date { get; set; }
        public string Notification_Message { get; set; } = string.Empty;
        public int NotificationStatus_ID { get; set; }
        public int ScheduledTask_ID { get; set; }
        public int Contractor_ID { get; set; }
    }
}