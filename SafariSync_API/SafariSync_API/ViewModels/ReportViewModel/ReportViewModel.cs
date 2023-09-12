using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.ViewModels.ReportViewModel
{
    public class ReportViewModel
    {
        [Required]
        public string Report_Title { get; set; } = string.Empty;

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public int User_ID { get; set; }

        [Required]
        public string PdfUrl { get; set; } = string.Empty;
    }
}