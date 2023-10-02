using SafariSync_API.Models.AuditActionModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models.AuditModel
{
    public class Audit
    {
        [Key]
        public int Audit_ID { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string Message { get; set; } = string.Empty;

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public int AuditAction_ID { get; set; }

        [ForeignKey("AuditAction_ID")]
        public AuditAction? AuditAction { get; set; }
    }
}