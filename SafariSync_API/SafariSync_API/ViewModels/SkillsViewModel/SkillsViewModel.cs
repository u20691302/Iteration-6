using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.ViewModels.SkillsViewModel
{
    public class SkillsViewModel
    {
        [Required]
        public string Skill_Name { get; set; } = string.Empty;

        [Required]
        public string Skill_Description { get; set; } = string.Empty;
    }
}