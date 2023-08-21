using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using SafariSync_API.Data;
using SafariSync_API.Models.Reporting;
using SafariSync_API.Models.SkillsModel;
using SafariSync_API.Repositories.CRUD;
using SafariSync_API.ViewModels.ReportViewModel;
using SafariSync_API.ViewModels.SkillsViewModel;
using System.ComponentModel.DataAnnotations;

namespace SafariSync_API.Controllers.SkillController
{
    // Specifies that the class is an API controller
    [ApiController]
    // Defines the route for the controller
    [Route("/api/[controller]")]
    public class ReportingController : ControllerBase
    {
        // Dependency injection of ICRUDRepository and SafariSyncDBContext
        private readonly ICRUDRepository iCRUDRepository;

        private readonly SafariSyncDBContext safariSyncDBContext;

        // Constructor to inject the dependencies
        public ReportingController(ICRUDRepository crudRepository, SafariSyncDBContext SafariSyncDBContext)
        {
            iCRUDRepository = crudRepository;
            safariSyncDBContext = SafariSyncDBContext;
        }

        [HttpPost]
        [Route("SaveReport")]
        public async Task<IActionResult> SaveReport(ReportViewModel rvm)
        {
            //try
            //{
                // Create a new report object using data from the ReportViewModel
                var report = new Report
                {
                    Report_Title = rvm.Report_Title,
                    CreatedAt = rvm.CreatedAt,
                    User_ID = rvm.User_ID,
                    PdfUrl  = rvm.PdfUrl,
                };

                // Add the report to the CRUD repository
                iCRUDRepository.Add(report);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return an Ok response with the added report
                return Ok(report);
            //}
            //catch (Exception)
            //{
            //    // Return a StatusCode 500 response if an exception occurs during the transaction
            //    return StatusCode(500, "Internal Server Error. Please contact support.");
            //}
        }

        [HttpGet]
        [Route("ReadAllReportsAsync")]
        public async Task<IActionResult> ReadAllReportsAsync()
        {
            try
            {
                var results = await safariSyncDBContext.Report
                    .Include(es => es.User!).ThenInclude(user => user.Ratings)
                    .ToListAsync();

                // Return an Ok response with the retrieved suppliers
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
