using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models.EquipmentModel
{
    public class Equipment
    {
        [Key]
        public int Equipment_ID { get; set; }

        [Required]
        public string Equipment_Name { get; set; } = string.Empty;

        [Required]
        public string Equipment_Description { get; set; } = string.Empty;

        [Required]
        public int Equipment_Quantity_On_Hand { get; set; } = 0;

        [Required]
        public int Equipment_Low_Level_Warning { get; set; } = 0;

        [ForeignKey("Equipment_ID")]
        public ICollection<EquipmentSupplier> EquipmentSupplier { get; set; } = new List<EquipmentSupplier>();
    }
}