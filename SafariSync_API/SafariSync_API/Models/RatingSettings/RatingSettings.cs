using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.Models.RatingSettings
{
    public class RatingSettings
    {
        [Key]
        public int RatingSettings_ID { get; set; }
        public int RatingSettings_Upper { get; set; }
        public int RatingSettings_Lower { get; set; }
    }
}
