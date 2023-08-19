using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.ViewModels.SupplierViewModel
{
    public class SupplierViewModel
    {
        [Required]
        public string Supplier_Name { get; set; } = string.Empty;

        [Required]
        public string Supplier_Phone_Number { get; set; } = string.Empty;

        [Required]
        public string Supplier_Email_Address { get; set; } = string.Empty;

        [Required]
        public string Supplier_Address { get; set; } = string.Empty;

        [Required]
        public int SupplierType_ID { get; set; }
    }
}