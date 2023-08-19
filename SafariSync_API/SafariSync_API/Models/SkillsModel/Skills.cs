using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.Models.SkillsModel
{
    public class Skills
    {
        [Key]
        public int Skill_ID { get; set; }

        [Required]
        public string Skill_Name { get; set; } = string.Empty;

        [Required]
        public string Skill_Description { get; set; } = string.Empty;
    }
}