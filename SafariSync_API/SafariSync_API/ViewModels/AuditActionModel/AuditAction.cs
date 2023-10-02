using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.Models.AuditActionModel
{
    public class AuditAction
    {
        [Key]
        public int AuditAction_ID { get; set; }

        [Required]
        public string AuditAction_Name { get; set; } = string.Empty;
    }
}