using SafariSync_API.Models.SupplierModel;
using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.ViewModels.EquipmentViewModel
{
    public class EquipmentViewModel
    {
        public int Equipment_ID { get; set; } = 0;

        [Required]
        public string Equipment_Name { get; set; } = string.Empty;

        [Required]
        public string Equipment_Description { get; set; } = string.Empty;

        [Required]
        public int Equipment_Quantity_On_Hand { get; set; } = 0;

        [Required]
        public int Equipment_Low_Level_Warning { get; set; } = 0;

        public Supplier[] Suppliers { get; set; } = Array.Empty<Supplier>();
    }
}