using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.ViewModels.AuditViewModel
{
    public class AuditViewModel
    {
        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string Message { get; set; } = string.Empty;

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public int AuditAction_ID { get; set; }
    }
}