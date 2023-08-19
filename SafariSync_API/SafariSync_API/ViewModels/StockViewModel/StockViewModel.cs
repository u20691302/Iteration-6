using SafariSync_API.Models.SupplierModel;
using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.ViewModels.StockViewModel
{
    public class StockViewModel
    {
        public int Stock_ID { get; set; } = 0;

        [Required]
        public string Stock_Name { get; set; } = string.Empty;

        [Required]
        public string Stock_Description { get; set; } = string.Empty;

        [Required]
        public int Stock_Quantity_On_Hand { get; set; } = 0;

        [Required]
        public int Stock_Low_Level_Warning { get; set; } = 0;

        //public ICollection<StockSupplierViewModel> StockSupplierViewModel { get; set; } = new List<StockSupplierViewModel>();

        public Supplier[] Suppliers { get; set; } = Array.Empty<Supplier>();
    }
}