using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models.StockModel
{
    public class Stock
    {
        [Key]
        public int Stock_ID { get; set; }

        [Required]
        public string Stock_Name { get; set; } = string.Empty;

        [Required]
        public string Stock_Description { get; set; } = string.Empty;

        [Required]
        public int Stock_Quantity_On_Hand { get; set; } = 0;

        [Required]
        public int Stock_Low_Level_Warning { get; set; } = 0;

        [ForeignKey("Stock_ID")]
        public ICollection<StockSupplier> StockSupplier { get; set; } = new List<StockSupplier>();
    }
}