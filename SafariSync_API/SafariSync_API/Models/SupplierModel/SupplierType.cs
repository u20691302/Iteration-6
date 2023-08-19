using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.Models.SupplierModel
{
    public class SupplierType
    {
        [Key]
        public int SupplierType_ID { get; set; }

        [Required]
        public string SupplierType_Name { get; set; } = string.Empty;
    }
}