using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.Models.ContractorModel
{
    public class ContractorType
    {
        [Key]
        public int ContractorType_ID { get; set; }

        [Required]
        public string ContractorType_Name { get; set; } = string.Empty;
    }
}