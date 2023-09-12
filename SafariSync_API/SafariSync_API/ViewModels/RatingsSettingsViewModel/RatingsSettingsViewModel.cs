using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.ViewModels.RatingSettingsViewModel
{
    public class RatingsSettingsViewModel
    {
        [Required]
        public int RatingSettings_Upper { get; set; }
        [Required]
        public int RatingSettings_Lower { get; set; }
    }
}
