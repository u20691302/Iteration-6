using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models.SupplierModel
{
    public class Supplier
    {
        [Key]
        public int Supplier_ID { get; set; }

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

        [ForeignKey("SupplierType_ID")]
        public SupplierType? SupplierType { get; set; }
    }
}