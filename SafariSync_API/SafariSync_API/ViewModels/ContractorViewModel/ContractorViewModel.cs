using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.ViewModels.ContractorViewModel
{
    public class ContractorViewModel
    {
        [Required]
        public string Contractor_Name { get; set; } = string.Empty;

        [Required]
        public string Contractor_Phone_Number { get; set; } = string.Empty;

        [Required]
        public string Contractor_Email_Address { get; set; } = string.Empty;

        [Required]
        public string Contractor_Address { get; set; } = string.Empty;

        [Required]
        public int ContractorType_ID { get; set; }
    }
}