using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SafariSync_API.Data;
using SafariSync_API.Models.ActivityModel;
using SafariSync_API.Models.EquipmentModel;
using SafariSync_API.Repositories.CRUD;
using SafariSync_API.ViewModels.ActivityViewModel;

namespace SafariSync_API.Controllers.ActivityController
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActivityController : ControllerBase
    {
        // Dependency injection of ICRUDRepository and SafariSyncDBContext
        private readonly ICRUDRepository iCRUDRepository;

        private readonly SafariSyncDBContext safariSyncDBContext;

        // Constructor to inject the dependencies
        public ActivityController(ICRUDRepository crudRepository, SafariSyncDBContext SafariSyncDBContext)
        {
            iCRUDRepository = crudRepository;
            safariSyncDBContext = SafariSyncDBContext;
        }

        [HttpPost]
        [Route("AddActivity")]
        public async Task<IActionResult> AddActivity(ActivityViewModel activityViewModel)
        {
            try
            {
                // Validate the input activity data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Create the Activity entity from the view model
                var activity = new Activity
                {
                    Activity_Name = activityViewModel.Activity_Name,
                    Activity_Description = activityViewModel.Activity_Description,
                };

                // Add the activity to the database using ICRUDRepository
                iCRUDRepository.Add(activity);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(activity);
            }
            catch (Exception)
            {
                //Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the activity.");
            }
        }

        [HttpGet]
        [Route("ReadAllActivityAsync")]
        public async Task<IActionResult> ReadAllActivityAsync()
        {
            try
            {
                // Fetch all activity using the ICRUDRepository
                var activity = await iCRUDRepository.ReadAllAsync<Activity>();

                // Fetch the associated tasks using eager loading
                var activityIds = activity.Select(e => e.Activity_ID).ToList();
                var activityTasks = await safariSyncDBContext.ActivityTask
                    .Where(es => activityIds.Contains(es.Activity_ID))
                    .Include(es => es.Task!)
                    .ThenInclude(est => est.Skill)
                    .ToListAsync();

                // Populate the ActivityTask property for each activity item
                foreach (var item in activity)
                {
                    // Filter the activityTasks list for the current activity item
                    var tasksForActivity = activityTasks
                        .Where(es => es.Activity_ID == item.Activity_ID)
                        .ToList();

                    // Assign the filtered list to the ActivityTask property of the current activity item
                    item.ActivityTask = tasksForActivity;
                }

                // Return the activity data with associated tasks
                return Ok(activity);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching activity data.");
            }
        }

        [HttpGet]
        [Route("ReadOneActivityAsync/{id}")]
        public async Task<IActionResult> ReadOneActivityByIdAsync(int id)
        {
            try
            {
                // Fetch the activity by ID using SafariSyncDBContext with eager loading of ActivityTask and Task
                var activity = await safariSyncDBContext.Activity
                    .Include(e => e.ActivityTask)
                    .ThenInclude(es => es.Task!)
                    .ThenInclude(est => est.Skill)
                    .FirstOrDefaultAsync(e => e.Activity_ID == id);

                // If activity with the given ID is not found, return a not found response
                if (activity == null)
                    return NotFound();

                // Return the activity data with associated tasks
                return Ok(activity);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching activity data.");
            }
        }

        [HttpPut]
        [Route("UpdateActivityAsync")]
        public async Task<IActionResult> UpdateActivityAsync(ActivityViewModel activityViewModel)
        {
            try
            {
                // Validate the input activity data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Fetch the existing activity by ID using SafariSyncDBContext
                var existingActivity = await safariSyncDBContext.Activity
                    .Include(e => e.ActivityTask)
                    .FirstOrDefaultAsync(e => e.Activity_ID == activityViewModel.Activity_ID);

                // If activity with the given ID is not found, return a not found response
                if (existingActivity == null)
                {
                    return NotFound();
                }

                // Update the Activity entity from the view model
                existingActivity.Activity_Name = activityViewModel.Activity_Name;
                existingActivity.Activity_Description = activityViewModel.Activity_Description;

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(existingActivity);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the activity.");
            }
        }

        [HttpDelete]
        [Route("DeleteActivity/{id}")]
        public async Task<IActionResult> DeleteActivity(int id)
        {
            try
            {
                // Fetch the existing activity by ID using SafariSyncDBContext
                var existingActivity = await safariSyncDBContext.Activity.Include(e => e.ActivityTask).ThenInclude(e => e.Task).FirstOrDefaultAsync(e => e.Activity_ID == id);

                // If activity with the given ID is not found, return a not found response
                if (existingActivity == null)
                {
                    return NotFound();
                }

                // Remove the activity from the database using ICRUDRepository
                iCRUDRepository.Delete(existingActivity);

                // Remove the associated activityTask records from the database using ICRUDRepository
                foreach (var activityTask in existingActivity.ActivityTask.ToList())
                {
                    iCRUDRepository.Delete(activityTask);

                    if (activityTask.Task != null)
                    {
                        iCRUDRepository.Delete(activityTask.Task);
                    }
                }

                try
                {
                    // Save changes asynchronously in the context
                    await safariSyncDBContext.SaveChangesAsync();

                    // Return the successful response
                    return Ok(existingActivity);
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

        [HttpPost]
        [Route("AddActivityTask")]
        public async Task<IActionResult> AddActivityTask(ActivityTaskViewModel activityTaskViewModel)
        {
            try
            {
                var task = await iCRUDRepository.ReadOneAsync<TaskS>(activityTaskViewModel.Task_ID);

                // Check if the task exists
                if (task == null)
                {
                    return NotFound($"Task with ID {activityTaskViewModel.Task_ID} not found.");
                }

                // Create the activityTask entity from the view model
                var activityTask = new ActivityTask
                {
                    Activity_ID = activityTaskViewModel.Activity_ID,
                    Task_ID = activityTaskViewModel.Task_ID
                };

                // Add the activityTask to the database using ICRUDRepository
                iCRUDRepository.Add(activityTask);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(activityTask);
            }
            catch (Exception)
            {
                //Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the activityTask.");
            }
        }

        [HttpGet]
        [Route("ReadOneActivityTaskAsync/{id}")]
        public async Task<IActionResult> ReadOneActivityTaskAsync(int id)
        {
            try
            {
                // Fetch the task by ID using SafariSyncDBContext
                var activityTask = await safariSyncDBContext.ActivityTask
                    .Include(e => e.Task)
                    .FirstOrDefaultAsync(e => e.ActivityTask_ID == id);

                // If task with the given ID is not found, return a not found response
                if (activityTask == null)
                    return NotFound();

                // Return the task data
                return Ok(activityTask);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching activitytask data.");
            }
        }

        [HttpDelete]
        [Route("DeleteActivityTask/{activityTaskID}")]
        public async Task<IActionResult> DeleteActivityTask(int activityTaskID)
        {
            try
            {
                var activityTask = await safariSyncDBContext.ActivityTask
                    .Include(e => e.Task)
                    .FirstOrDefaultAsync(e => e.ActivityTask_ID == activityTaskID);

                // If the existing task is not found, return a NotFound response with an appropriate message
                if (activityTask == null)
                    return NotFound("The activitytask does not exist");

                // Delete the task from the CRUD repository
                iCRUDRepository.Delete(activityTask);

                if (activityTask.Task != null)
                {
                    iCRUDRepository.Delete(activityTask.Task);
                }

                // Save changes asynchronously in the context
                await safariSyncDBContext.SaveChangesAsync();

                // Return the successful response
                return Ok(activityTask);
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
                    // Return a StatusCode 500 response for any other DbUpdateException
                    return StatusCode(500, "Internal Server Error. Please contact support.");
                }
            }
        }

        [HttpPost]
        [Route("AddTask")]
        public async Task<IActionResult> AddTask(TaskViewModel taskViewModel)
        {
            try
            {
                // Validate the input task data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Create the task entity from the view model
                var task = new TaskS
                {
                    Task_Name = taskViewModel.Task_Name,
                    Task_Description = taskViewModel.Task_Description,
                    Skill_ID = taskViewModel.Skill_ID
                };

                // Add the task to the database using ICRUDRepository
                iCRUDRepository.Add(task);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(task);
            }
            catch (Exception)
            {
                //Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the task.");
            }
        }

        [HttpGet]
        [Route("ReadOneTaskAsync/{id}")]
        public async Task<IActionResult> ReadOneTaskByIdAsync(int id)
        {
            try
            {
                // Fetch the task by ID using SafariSyncDBContext
                var task = await safariSyncDBContext.TaskS
                    .Include(e => e.Skill)
                    .FirstOrDefaultAsync(e => e.Task_ID == id);

                // If task with the given ID is not found, return a not found response
                if (task == null)
                    return NotFound();

                // Return the task data
                return Ok(task);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching activity data.");
            }
        }

        [HttpPut]
        [Route("UpdateTaskAsync")]
        public async Task<IActionResult> UpdateTaskAsync(TaskViewModel taskViewModel)
        {
            try
            {
                // Validate the input task data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Fetch the existing task by ID using SafariSyncDBContext
                var existingTask = await safariSyncDBContext.TaskS
                    .Include(e => e.Skill)
                    .FirstOrDefaultAsync(e => e.Task_ID == taskViewModel.Task_ID);

                // If activity with the given ID is not found, return a not found response
                if (existingTask == null)
                {
                    return NotFound();
                }

                // Update the task entity from the view model
                existingTask.Task_Name = taskViewModel.Task_Name;
                existingTask.Task_Description = taskViewModel.Task_Description;
                existingTask.Skill_ID = taskViewModel.Skill_ID;

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(existingTask);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the activity.");
            }
        }
    }
}