using SafariSync_API.Models.SkillsModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models.ActivityModel
{
    public class TaskS
    {
        [Key]
        public int Task_ID { get; set; }

        [Required]
        public string Task_Name { get; set; } = string.Empty;

        [Required]
        public string Task_Description { get; set; } = string.Empty;

        [Required]
        public int Skill_ID { get; set; }

        [ForeignKey("Skill_ID")]
        public Skills? Skill { get; set; }
    }
}