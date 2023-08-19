using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SafariSync_API.Data;
using SafariSync_API.Repositories.CRUD;
using SafariSync_API.ViewModels.ScheduledActivity;

namespace SafariSync_API.Controllers.ScheduledScheduledActivityController
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScheduledActivityController : ControllerBase
    {
        // Dependency injection of ICRUDRepository and SafariSyncDBContext
        private readonly ICRUDRepository iCRUDRepository;

        private readonly SafariSyncDBContext safariSyncDBContext;

        // Constructor to inject the dependencies
        public ScheduledActivityController(ICRUDRepository crudRepository, SafariSyncDBContext SafariSyncDBContext)
        {
            iCRUDRepository = crudRepository;
            safariSyncDBContext = SafariSyncDBContext;
        }

        [HttpGet]
        [Route("ReadAllScheduledActivityAsync")]
        public async Task<IActionResult> ReadAllScheduledActivityAsync()
        {
            //try
            //{
            var scheduledActivity = await safariSyncDBContext.ScheduledActivity
            .Include(es => es.Users!).ThenInclude(es => es.Ratings)
            .Include(es => es.ActivityStatus)
            .Include(es => es.Activity)
            .Include(es => es.ScheduledActivityScheduledTask!).ThenInclude(es => es.ScheduledTask!)
                                                              .ThenInclude(es => es.Task!).ThenInclude(es => es.Skill).ToListAsync();

            // Return the scheduledActivity data with associated scheduledTasks
            return Ok(scheduledActivity);
            //}
            //catch (Exception)
            //{
            //    // Handle the exception and return an error response
            //    return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching scheduledActivity data.");
            //}
        }

        [HttpGet]
        [Route("ReadOneScheduledActivityAsync/{id}")]
        public async Task<IActionResult> ReadOneScheduledActivityAsync(int id)
        {
            try
            {
                var scheduledActivity = await safariSyncDBContext.ScheduledActivity
               .Include(es => es.Users!).ThenInclude(es => es.Ratings)
               .Include(es => es.ActivityStatus)
               .Include(es => es.Activity)
               .Include(es => es.ScheduledActivityScheduledTask!).ThenInclude(es => es.ScheduledTask!)
                                                                 .ThenInclude(es => es.Task!).ThenInclude(es => es.Skill)
               .FirstOrDefaultAsync(es => es.Activity_ID == id);

                // If activity with the given ID is not found, return a not found response
                if (scheduledActivity == null)
                    return NotFound();

                // Return the activity data with associated tasks
                return Ok(scheduledActivity);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching activity data.");
            }
        }

        [HttpGet]
        [Route("ReadOneScheduledTaskUserAsync/{id}")]
        public async Task<IActionResult> ReadOneScheduledTaskUserAsync(int id)
        {
            try
            {
                // Fetch the equipment by ID using SafariSyncDBContext with eager loading of EquipmentSupplier and Supplier
                var scheduledActivityUser = await safariSyncDBContext.ScheduledTaskUser
                     .Include(e => e.User)
                     .Where(e => e.ScheduledTask_ID == id)
                     .ToListAsync();

                // If equipment with the given ID is not found, return a not found response
                if (scheduledActivityUser == null)
                    return NotFound();

                // Return the equipment data with associated suppliers
                return Ok(scheduledActivityUser);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching scheduled task user data data.");
            }
        }

        [HttpGet]
        [Route("ReadOneScheduledTaskContractorAsync/{id}")]
        public async Task<IActionResult> ReadOneScheduledTaskContractorAsync(int id)
        {
            try
            {
                // Fetch the equipment by ID using SafariSyncDBContext with eager loading of EquipmentSupplier and Supplier
                var scheduledActivityContractor = await safariSyncDBContext.ScheduledTaskContractor
                     .Include(e => e.Contractor)
                     .Where(e => e.ScheduledTask_ID == id)
                     .ToListAsync();

                // If equipment with the given ID is not found, return a not found response
                if (scheduledActivityContractor == null)
                    return NotFound();

                // Return the equipment data with associated suppliers
                return Ok(scheduledActivityContractor);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching scheduled task user data data.");
            }
        }

        [HttpPost]
        [Route("AddScheduledActivity")]
        public async Task<IActionResult> AddScheduledActivity(ScheduledActivityViewModel scheduledActivityViewModel)
        {
            try
            {
                // Validate the input activity data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Create the Activity entity from the view model
                var scheduledActivity = new ScheduledActivity
                {
                    StartDate = scheduledActivityViewModel.StartDate,
                    EndDate = scheduledActivityViewModel.EndDate,
                    Activity_Location = scheduledActivityViewModel.Activity_Location,
                    User_ID = scheduledActivityViewModel.UserId,
                    ActivityStatus_ID = scheduledActivityViewModel.ActivityStatus_ID,
                    Activity_ID = scheduledActivityViewModel.Activity_ID
                };

                // Add the activity to the database using ICRUDRepository
                iCRUDRepository.Add(scheduledActivity);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(scheduledActivity);
            }
            catch (Exception)
            {
                //Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the activity.");
            }
        }
    }
}