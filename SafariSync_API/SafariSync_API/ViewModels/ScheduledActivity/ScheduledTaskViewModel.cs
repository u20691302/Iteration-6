using SafariSync_API.Models.ContractorModel;
using SafariSync_API.Models.UserModel;
using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.ViewModels.ScheduledTask
{
    public class ScheduledTaskViewModel
    {
        public int ScheduledTask_ID { get; set; }

        
        public DateTime StartDate { get; set; }

        
        public DateTime EndDate { get; set; }

        
        public int TaskStatus_ID { get; set; }

      
        public int Task_ID { get; set; }

        public User[] Users { get; set; } = Array.Empty<User>();

        public Contractor[] Contractors { get; set; } = Array.Empty<Contractor>();
    }
}