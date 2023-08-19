using SafariSync_API.Models.EquipmentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models.ToolboxModel
{
    public class ToolboxEquipment
    {
        [Key]
        public int ToolboxEquipment_ID { get; set; }

        [Required]
        public int Toolbox_ID { get; set; }

        [Required]
        public int Equipment_ID { get; set; }

        [Required]
        public int Quantity { get; set; }

        [ForeignKey("Equipment_ID")]
        public Equipment? Equipment { get; set; }
    }
}