using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using SafariSync_API.Models.SkillsModel;

namespace SafariSync_API.Models.UserModel
{
    public class UserSkill
    {
        [Key]
        public int UserSkill_ID { get; set; }

        [Required]
        public int User_ID { get; set; }

        [Required]
        public int Skill_ID { get; set; }

        [ForeignKey("Skill_ID")]
        public Skills? Skills { get; set; }
    }
}
