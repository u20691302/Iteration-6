using SafariSync_API.Models.SupplierModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models.StockModel
{
    public class StockSupplier
    {
        [Key]
        public int StockSupplier_ID { get; set; }

        [Required]
        public int Stock_ID { get; set; }

        [Required]
        public int Supplier_ID { get; set; }

        [ForeignKey("Supplier_ID")]
        public Supplier? Supplier { get; set; }
    }
}