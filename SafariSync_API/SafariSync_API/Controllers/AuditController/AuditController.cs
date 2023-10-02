using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SafariSync_API.Data;
using SafariSync_API.Models.AuditModel;
using SafariSync_API.Repositories.CRUD;
using SafariSync_API.ViewModels.AuditViewModel;

namespace SafariSync_API.Controllers.AuditController
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditController : ControllerBase
    {
        // Dependency injection of ICRUDRepository and SafariSyncDBContext
        private readonly ICRUDRepository iCRUDRepository;

        private readonly SafariSyncDBContext safariSyncDBContext;

        // Constructor to inject the dependencies
        public AuditController(ICRUDRepository crudRepository, SafariSyncDBContext SafariSyncDBContext)
        {
            iCRUDRepository = crudRepository;
            safariSyncDBContext = SafariSyncDBContext;
        }

        [HttpPost]
        [Route("AddAudit")]
        public async Task<IActionResult> AddAudit(AuditViewModel svm)
        {
            try
            {
                // Create a new Skill object using data from the SkillViewModel
                var audit = new Audit
                {
                    Date = svm.Date,
                    Message = svm.Message,
                    Username = svm.Username,
                    AuditAction_ID = svm.AuditAction_ID,
                };

                // Add the skill to the CRUD repository
                iCRUDRepository.Add(audit);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return an Ok response with the added skill
                return Ok(audit);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the transaction
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("ReadAllAuditsAsync")]
        public async Task<IActionResult> ReadAllAuditsAsync()
        {
            try
            {
                var results = await safariSyncDBContext.Audit.Include(e => e.AuditAction).OrderBy(Audit => Audit.Date).ToListAsync();

                // Return an Ok response with the retrieved skills
                return Ok(results);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
    }
}