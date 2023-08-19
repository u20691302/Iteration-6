using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models.ContractorModel
{
    public class Contractor
    {
        [Key]
        public int Contractor_ID { get; set; }

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

        [ForeignKey("ContractorType_ID")]
        public ContractorType? ContractorType { get; set; }
    }
}