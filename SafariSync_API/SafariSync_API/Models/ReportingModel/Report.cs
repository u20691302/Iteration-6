using SafariSync_API.Models.UserModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models.Reporting
{
    public class Report
    {
        [Key]
        public int Report_ID { get; set; }

        [Required]
        public string Report_Title { get; set; } = string.Empty;

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public int User_ID { get; set; }

        [Required]
        public string PdfUrl { get; set; } = string.Empty;

        [ForeignKey("User_ID")]
        public User? User { get; set; }
    }
}