using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.Models.UserModel
{
    public class Timer
    {
        [Key]
        public int Timer_ID { get; set; }
        public int Timer_Time { get; set; }
    }
}
