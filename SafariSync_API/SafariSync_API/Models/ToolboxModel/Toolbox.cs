using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models.ToolboxModel
{
    public class Toolbox
    {
        [Key]
        public int Toolbox_ID { get; set; }

        [Required]
        public string Toolbox_Name { get; set; } = string.Empty;

        [Required]
        public string Toolbox_Description { get; set; } = string.Empty;

        [ForeignKey("Toolbox_ID")]
        public ICollection<ToolboxEquipment> ToolboxEquipment { get; set; } = new List<ToolboxEquipment>();

        [ForeignKey("Toolbox_ID")]
        public ICollection<ToolboxStock> ToolboxStock { get; set; } = new List<ToolboxStock>();
    }
}