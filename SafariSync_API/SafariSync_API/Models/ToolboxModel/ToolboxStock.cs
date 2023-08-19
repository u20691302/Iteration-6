using SafariSync_API.Models.StockModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models.ToolboxModel
{
    public class ToolboxStock
    {
        [Key]
        public int ToolboxStock_ID { get; set; }

        [Required]
        public int Toolbox_ID { get; set; }

        [Required]
        public int Stock_ID { get; set; }

        [Required]
        public int Quantity { get; set; }

        [ForeignKey("Stock_ID")]
        public Stock? Stock { get; set; }
    }
}