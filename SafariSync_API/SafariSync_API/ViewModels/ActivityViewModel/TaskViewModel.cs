using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.ViewModels.ActivityViewModel
{
    public class TaskViewModel
    {
        public int Task_ID { get; set; }

        [Required]
        public string Task_Name { get; set; } = string.Empty;

        [Required]
        public string Task_Description { get; set; } = string.Empty;

        [Required]
        public int Skill_ID { get; set; }
    }
}