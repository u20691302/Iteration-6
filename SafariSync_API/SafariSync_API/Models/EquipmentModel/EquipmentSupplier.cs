using SafariSync_API.Models.SupplierModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models.EquipmentModel
{
    public class EquipmentSupplier
    {
        [Key]
        public int EquipmentSupplier_ID { get; set; }

        [Required]
        public int Equipment_ID { get; set; }

        [Required]
        public int Supplier_ID { get; set; }

        [ForeignKey("Supplier_ID")]
        public Supplier? Supplier { get; set; }
    }
}