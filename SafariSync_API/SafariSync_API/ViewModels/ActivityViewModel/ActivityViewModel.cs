using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.Models.ActivityModel
{
    public class ActivityViewModel
    {
        public int Activity_ID { get; set; }

        [Required]
        public string Activity_Name { get; set; } = string.Empty;

        [Required]
        public string Activity_Description { get; set; } = string.Empty;
    }
}