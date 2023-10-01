using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SafariSync_API.Data;
using SafariSync_API.Models;
using SafariSync_API.Models.ActivityModel;
using SafariSync_API.Models.EquipmentModel;
using SafariSync_API.Models.SupplierModel;
using SafariSync_API.Repositories.CRUD;
using SafariSync_API.ViewModels.ActivityViewModel;
using SafariSync_API.ViewModels.EquipmentViewModel;
using SafariSync_API.ViewModels.ScheduledActivity;
using SafariSync_API.ViewModels.ScheduledTask;

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
            try
            {
                var scheduledActivity = await safariSyncDBContext.ScheduledActivity
                    .Include(es => es.Users!).ThenInclude(es => es.Ratings)
                    .Include(es => es.ActivityStatus)
                    .Include(es => es.Activity)
                    .Include(es => es.ScheduledActivityScheduledTask!).ThenInclude(es => es.ScheduledTask!).ThenInclude(es => es.TaskStatus!)
                    .Include(es => es.ScheduledActivityScheduledTask!).ThenInclude(es => es.ScheduledTask!).ThenInclude(es => es.Task!).ThenInclude(es => es.Skill)
                    .ToListAsync();


                // Return the scheduledActivity data with associated scheduledTasks
                return Ok(scheduledActivity);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching scheduledActivity data.");
            }
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
                    .Include(es => es.ScheduledActivityScheduledTask!).ThenInclude(es => es.ScheduledTask!).ThenInclude(es => es.TaskStatus!)
                    .Include(es => es.ScheduledActivityScheduledTask!).ThenInclude(es => es.ScheduledTask!).ThenInclude(es => es.Task!).ThenInclude(es => es.Skill)
                    .FirstOrDefaultAsync(es => es.ScheduledActivity_ID == id);

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
        [Route("ReadOneScheduledTaskAsync/{id}")]
        public async Task<IActionResult> ReadOneScheduledTaskAsync(int id)
        {
            try
            {
                var scheduledTask = await safariSyncDBContext.ScheduledTask.Include(es => es.ScheduledTaskUser!).ThenInclude(es => es.User)
                    .Include(es => es.ScheduledTaskContractor!).ThenInclude(es => es.Contractor)
                    .FirstOrDefaultAsync(es => es.ScheduledTask_ID == id);

                // If activity with the given ID is not found, return a not found response
                if (scheduledTask == null)
                    return NotFound();

                // Return the activity data with associated tasks
                return Ok(scheduledTask);
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
                    User_ID = scheduledActivityViewModel.User_ID,
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

        [HttpPost]
        [Route("AddScheduledTask")]
        public async Task<IActionResult> AddScheduledTask(ScheduledTaskViewModel scheduledTaskViewModel)
        {
            try
            {
                // Validate the input equipment data if necessary
                if (!ModelState.IsValid)
                {
                return BadRequest(ModelState);
                }

                // Create the Equipment entity from the view model
                var scheduledTask = new ScheduledTask
                {
                    StartDate = scheduledTaskViewModel.StartDate,
                    EndDate = scheduledTaskViewModel.EndDate,
                    TaskStatus_ID = scheduledTaskViewModel.TaskStatus_ID,
                    Task_ID = scheduledTaskViewModel.Task_ID,
                };

                // Add the equipment to the database using ICRUDRepository
                iCRUDRepository.Add(scheduledTask);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(scheduledTask);
            }
            catch (Exception)
            {
                //Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the equipment.");
            }
        }

        [HttpPost]
        [Route("AddScheduledActivityScheduledTask")]
        public async Task<IActionResult> AddScheduledActivityScheduledTask(ScheduledActivityScheduledTaskViewModel scheduledActivityScheduledTaskViewModel)
        {
            try
            {
                // Create the activityTask entity from the view model
                var scheduledActivityScheduledTask = new ScheduledActivityScheduledTask
                {
                    ScheduledActivity_ID = scheduledActivityScheduledTaskViewModel.ScheduledActivity_ID,
                    ScheduledTask_ID = scheduledActivityScheduledTaskViewModel.ScheduledTask_ID
                };

                // Add the activityTask to the database using ICRUDRepository
                iCRUDRepository.Add(scheduledActivityScheduledTask);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(scheduledActivityScheduledTask);
            }
            catch (Exception)
            {
                //Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the scheduledActivityScheduledTask.");
            }
        }

        [HttpPost]
        [Route("AddScheduledTaskUser")]
        public async Task<IActionResult> AddScheduledTaskUser(ScheduledTaskUserViewModel scheduledTaskUserViewModel)
        {
            if (scheduledTaskUserViewModel.Users == null || !scheduledTaskUserViewModel.Users.Any())
            {
                // If the Users list is empty, return a BadRequest response
                return BadRequest("No users provided in the request.");
            }

            // Initialize a list to hold the ScheduledTaskUser objects that are created
            List<ScheduledTaskUser> scheduledTasks = new List<ScheduledTaskUser>();

            foreach (var user in scheduledTaskUserViewModel.Users)
            {
                var scheduledTask = new ScheduledTaskUser
                {
                    ScheduledTask_ID = scheduledTaskUserViewModel.ScheduledTask_ID,
                    User_ID = user.User_ID
                };
                iCRUDRepository.Add(scheduledTask);

                // Add the newly created ScheduledTaskUser to the list
                scheduledTasks.Add(scheduledTask);
            }

            try
            {
                await iCRUDRepository.SaveChangesAsync();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the scheduled task user.");
            }

            // Return the list of ScheduledTaskUser objects
            return Ok(scheduledTasks);
        }

        [HttpPost]
        [Route("AddScheduledTaskContractor")]
        public async Task<IActionResult> AddScheduledTaskContractor(ScheduledTaskContractorViewModel scheduledTaskContractorViewModel)
        {
            if (scheduledTaskContractorViewModel.Contractors == null || !scheduledTaskContractorViewModel.Contractors.Any())
            {
                // If the Users list is empty, return a BadRequest response
                return BadRequest("No contractors provided in the request.");
            }

            // Initialize a list to hold the ScheduledTaskUser objects that are created
            List<ScheduledTaskContractor> scheduledTasks = new List<ScheduledTaskContractor>();

            foreach (var contractor in scheduledTaskContractorViewModel.Contractors)
            {
                var scheduledTaskContractor = new ScheduledTaskContractor
                {
                    ScheduledTask_ID = scheduledTaskContractorViewModel.ScheduledTask_ID,
                    Contractor_ID = contractor.Contractor_ID
                };
                iCRUDRepository.Add(scheduledTaskContractor);

                // Add the newly created ScheduledTaskUser to the list
                scheduledTasks.Add(scheduledTaskContractor);
            }

            try
            {
                await iCRUDRepository.SaveChangesAsync();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the scheduled task contractor.");
            }

            // Return the list of ScheduledTaskUser objects
            return Ok(scheduledTasks);
        }

        [HttpDelete]
        [Route("DeleteScheduledActivity/{id}")]
        public async Task<IActionResult> DeleteScheduledActivity(int id)
        {
            try
            {
                var notificationSupervisor = await safariSyncDBContext.NotificationSupervisor.FirstOrDefaultAsync(e => e.ScheduledActivity_ID == id);

                if (notificationSupervisor != null)
                {
                    iCRUDRepository.Delete(notificationSupervisor);
                }
                
                var notificationAdmin = await safariSyncDBContext.NotificationAdmin.FirstOrDefaultAsync(e => e.ScheduledActivity_ID == id);

                if (notificationAdmin != null)
                {
                    iCRUDRepository.Delete(notificationAdmin);
                }
                
                // Fetch the existing activity by ID using SafariSyncDBContext
                var existingScheduledActivity = await safariSyncDBContext.ScheduledActivity
                    .Include(e => e.ScheduledActivityScheduledTask)
                        .ThenInclude(e => e.ScheduledTask!)
                        .ThenInclude(e => e.ScheduledTaskUser)
                    .Include(e => e.ScheduledActivityScheduledTask)
                        .ThenInclude(e => e.ScheduledTask!)
                        .ThenInclude(e => e.ScheduledTaskContractor)
                        .FirstOrDefaultAsync(e => e.ScheduledActivity_ID == id);

                // If activity with the given ID is not found, return a not found response
                if (existingScheduledActivity == null)
                {
                    return NotFound();
                }

                // Remove the activity from the database using ICRUDRepository
                iCRUDRepository.Delete(existingScheduledActivity);

                // Remove the associated activityTask records from the database using ICRUDRepository
                foreach (var ScheduledActivityScheduledTask in existingScheduledActivity.ScheduledActivityScheduledTask.ToList())
                {
                    iCRUDRepository.Delete(ScheduledActivityScheduledTask);

                    if (ScheduledActivityScheduledTask.ScheduledTask != null)
                    {
                        iCRUDRepository.Delete(ScheduledActivityScheduledTask.ScheduledTask);
                    }
                }

                foreach (var scheduledActivityScheduledTask in existingScheduledActivity.ScheduledActivityScheduledTask.ToList())
                {
                    foreach (var scheduledTaskUser in scheduledActivityScheduledTask.ScheduledTask!.ScheduledTaskUser.ToList())
                    {
                        iCRUDRepository.Delete(scheduledTaskUser);

                        if (scheduledTaskUser.User != null)
                        {
                            iCRUDRepository.Delete(scheduledTaskUser.User);
                        }
                    }
                }

                foreach (var scheduledActivityScheduledTask in existingScheduledActivity.ScheduledActivityScheduledTask.ToList())
                {
                    foreach (var scheduledTaskContractor in scheduledActivityScheduledTask.ScheduledTask!.ScheduledTaskContractor.ToList())
                    {
                        iCRUDRepository.Delete(scheduledTaskContractor);

                        if (scheduledTaskContractor.Contractor != null)
                        {
                            iCRUDRepository.Delete(scheduledTaskContractor.Contractor);
                        }
                    }
                }

                try
                {
                    // Save changes asynchronously in the context
                    await safariSyncDBContext.SaveChangesAsync();

                    // Return the successful response
                    return Ok(existingScheduledActivity);
                }
                catch (DbUpdateException ex)
                {
                    // Check if the exception is due to a foreign key violation
                    if (ex.InnerException is SqlException sqlEx && sqlEx.Number == 547)
                    {
                        // Return a 400 Bad Request status code indicating the foreign key violation
                        return BadRequest("Cannot delete the toolbox because it is associated with other entities.");
                    }
                    else
                    {
                        // Handle other exceptions and return an error response
                        return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the activity.");
                    }
                }
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the activity.");
            }
        }

        [HttpDelete]
        [Route("DeleteScheduledActivityScheduledTask/{id}")]
        public async Task<IActionResult> DeleteScheduledActivityScheduledTask(int id)
        {
           
                // Fetch the existing activity by ID using SafariSyncDBContext
                var existingScheduledTask = await safariSyncDBContext.ScheduledActivityScheduledTask
                    .Include(e => e.ScheduledTask!.ScheduledTaskUser)
                    .Include(e => e.ScheduledTask!.ScheduledTaskContractor)
                    .FirstOrDefaultAsync(e => e.ScheduledTask_ID == id);

                // If activity with the given ID is not found, return a not found response
                if (existingScheduledTask == null)
                {
                    return NotFound();
                }

                // Remove the activity from the database using ICRUDRepository
                iCRUDRepository.Delete(existingScheduledTask);

                // Remove the associated activityTask records from the database using ICRUDRepository
                foreach (var scheduledTaskUser in existingScheduledTask.ScheduledTask!.ScheduledTaskUser.ToList())
                {
                    iCRUDRepository.Delete(scheduledTaskUser);
                }

                foreach (var scheduledTaskContractor in existingScheduledTask.ScheduledTask!.ScheduledTaskContractor.ToList())
                {
                    iCRUDRepository.Delete(scheduledTaskContractor);

                    if (scheduledTaskContractor.Contractor != null)
                    {
                        iCRUDRepository.Delete(scheduledTaskContractor.Contractor);
                    }
                }

                // Save changes asynchronously in the context
                await safariSyncDBContext.SaveChangesAsync();

                // Return the successful response
                return Ok(existingScheduledTask);
        }

        [HttpPut]
        [Route("UpdateScheduledActivity")]
        public async Task<IActionResult> UpdateScheduledActivity(ScheduledActivityViewModel scheduledActivityViewModel)
        {
            try
            {
                // Validate the input activity data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Fetch the existing activity by ID using SafariSyncDBContext
                var existingScheduledActivity = await safariSyncDBContext.ScheduledActivity
                    .FirstOrDefaultAsync(e => e.ScheduledActivity_ID == scheduledActivityViewModel.ScheduledActivity_ID);

                // If activity with the given ID is not found, return a not found response
                if (existingScheduledActivity == null)
                {
                    return NotFound();
                }

                // Update the Activity entity from the view model
                existingScheduledActivity.StartDate = scheduledActivityViewModel.StartDate;
                existingScheduledActivity.EndDate = scheduledActivityViewModel.EndDate;
                existingScheduledActivity.Activity_Location = scheduledActivityViewModel.Activity_Location;
                existingScheduledActivity.User_ID = scheduledActivityViewModel.User_ID;
                existingScheduledActivity.Activity_ID = scheduledActivityViewModel.Activity_ID;

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(existingScheduledActivity);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the activity.");
            }
        }


        [HttpPut]
        [Route("UpdateScheduledTask")]
        public async Task<IActionResult> UpdateScheduledTask(ScheduledTaskViewModel scheduledTaskViewModel)
        {
            try
            {
                // Validate the input activity data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Fetch the existing activity by ID using SafariSyncDBContext
                var existingScheduledTask = await safariSyncDBContext.ScheduledTask.Include(e => e.ScheduledTaskUser).Include(e => e.ScheduledTaskContractor)
                    .FirstOrDefaultAsync(e => e.ScheduledTask_ID == scheduledTaskViewModel.ScheduledTask_ID);

                // If activity with the given ID is not found, return a not found response
                if (existingScheduledTask == null)
                {
                    return NotFound();
                }

                // Update the Activity entity from the view model
                existingScheduledTask.StartDate = scheduledTaskViewModel.StartDate;
                existingScheduledTask.EndDate = scheduledTaskViewModel.EndDate;
                existingScheduledTask.TaskStatus_ID = scheduledTaskViewModel.TaskStatus_ID;
                existingScheduledTask.Task_ID = scheduledTaskViewModel.Task_ID;

                // Remove existing EquipmentSupplier records associated with this equipment
                foreach (var existingUser in existingScheduledTask.ScheduledTaskUser.ToList())
                {
                    existingScheduledTask.ScheduledTaskUser.Remove(existingUser);
                }

                List<ScheduledTaskUser> scheduledTaskUsers = new List<ScheduledTaskUser>();

                foreach (var user in scheduledTaskViewModel.Users)
                {
                    var scheduledTaskUser = new ScheduledTaskUser
                    {
                        ScheduledTask_ID = scheduledTaskViewModel.ScheduledTask_ID,
                        User_ID = user.User_ID
                    };
                    iCRUDRepository.Add(scheduledTaskUser);

                    // Add the newly created ScheduledTaskUser to the list
                    scheduledTaskUsers.Add(scheduledTaskUser);
                }

                // Remove existing EquipmentSupplier records associated with this equipment
                foreach (var existingUser in existingScheduledTask.ScheduledTaskContractor.ToList())
                {
                        existingScheduledTask.ScheduledTaskContractor.Remove(existingUser);
                }             

                List<ScheduledTaskContractor> scheduledTask = new List<ScheduledTaskContractor>();

                foreach (var contractor in scheduledTaskViewModel.Contractors)
                {
                    var scheduledTaskContractor = new ScheduledTaskContractor
                    {
                        ScheduledTask_ID = scheduledTaskViewModel.ScheduledTask_ID,
                        Contractor_ID = contractor.Contractor_ID
                    };
                    iCRUDRepository.Add(scheduledTaskContractor);

                    // Add the newly created ScheduledTaskContractor to the list
                    scheduledTask.Add(scheduledTaskContractor);
                }

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();



            // Return the successful response
            return Ok(existingScheduledTask);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the activity.");
            }
        }
    }
}