using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.ViewModels.Toolbox
{
    public class ToolboxViewModel
    {
        public int Toolbox_ID { get; set; }

        [Required]
        public string Toolbox_Name { get; set; } = string.Empty;

        [Required]
        public string Toolbox_Description { get; set; } = string.Empty;
    }
}