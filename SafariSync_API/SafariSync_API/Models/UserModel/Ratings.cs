using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.Models.UserModel
{
    public class Ratings
    {
        [Key]
        public int Rating_ID { get; set; }

        [Required]
        public decimal Rating { get; set; }
    }
}