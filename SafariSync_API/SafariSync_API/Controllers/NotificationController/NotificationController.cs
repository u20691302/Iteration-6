using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SafariSync_API.Data;
using SafariSync_API.Models;
using SafariSync_API.Models.ActivityModel;
using SafariSync_API.Models.EquipmentModel;
using SafariSync_API.Models.NotificationModel;
using SafariSync_API.Models.SupplierModel;
using SafariSync_API.Repositories.CRUD;
using SafariSync_API.ViewModels.ActivityViewModel;
using SafariSync_API.ViewModels.EquipmentViewModel;
using SafariSync_API.ViewModels.ScheduledActivity;
using SafariSync_API.ViewModels.ScheduledTask;

namespace SafariSync_API.Controllers.NotificationController
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        // Dependency injection of ICRUDRepository and SafariSyncDBContext
        private readonly ICRUDRepository iCRUDRepository;

        private readonly SafariSyncDBContext safariSyncDBContext;

        // Constructor to inject the dependencies
        public NotificationController(ICRUDRepository crudRepository, SafariSyncDBContext SafariSyncDBContext)
        {
            iCRUDRepository = crudRepository;
            safariSyncDBContext = SafariSyncDBContext;
        }

        [HttpGet]
        [Route("ReadSupervisorNotifications")]
        public async Task<IActionResult> ReadSupervisorNotifications()
        {
            try
            {
                var scheduledActivity = await safariSyncDBContext.NotificationSupervisor.Include(e => e.User)
                                                                                        .Include(e => e.NotificationStatus)
                                                                                        .Include(e => e.ScheduledActivity!).ThenInclude(e => e.ScheduledActivityScheduledTask)
                                                                                                                          .ThenInclude(e => e.ScheduledTask)
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
        [Route("ReadUserNotifications")]
        public async Task<IActionResult> ReadUserNotifications()
        {
            try
            {
                var scheduledActivity = await safariSyncDBContext.NotificationUser.Include(e => e.User)
                                                                                        .Include(e => e.NotificationStatus)
                                                                                        .Include(e => e.ScheduledTask).ToListAsync();

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
        [Route("ReadAdminNotifications")]
        public async Task<IActionResult> ReadAdminNotifications()
        {
            try
            {
                var scheduledActivity = await safariSyncDBContext.NotificationAdmin.Include(e => e.User!)
                                                                                        .Include(e => e.NotificationStatus)
                                                                                        .Include(e => e.ScheduledActivity!).ThenInclude(e => e.ScheduledActivityScheduledTask)
                                                                                                                          .ThenInclude(e => e.ScheduledTask)
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

        [HttpPost]
        [Route("AddNotificationSupervisor")]
        public async Task<IActionResult> AddNotificationSupervisor(NotificationSupervisor notificationSupervisor)
        {
            try
            {
                // Validate the input activity data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Create the Activity entity from the view model
                var noticiationSupervisor = new NotificationSupervisor
                {
                    Date = notificationSupervisor.Date,
                    User_ID = notificationSupervisor.User_ID,
                    Notification_Message = notificationSupervisor.Notification_Message,
                    NotificationStatus_ID = notificationSupervisor.NotificationStatus_ID,
                    ScheduledActivity_ID = notificationSupervisor.ScheduledActivity_ID
                };

                // Add the activity to the database using ICRUDRepository
                iCRUDRepository.Add(noticiationSupervisor);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(noticiationSupervisor);
            }
            catch (Exception)
            {
                //Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the activity.");
            }
        }

        [HttpPost]
        [Route("AddNotificationUser")]
        public async Task<IActionResult> AddNotificationUser(NotificationUser notificationUser)
        {
            try
            {
                // Validate the input activity data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Create the Activity entity from the view model
                var notificationUsers = new NotificationUser
                {
                    Date = notificationUser.Date,
                    User_ID = notificationUser.User_ID,
                    Notification_Message = notificationUser.Notification_Message,
                    NotificationStatus_ID = notificationUser.NotificationStatus_ID,
                    ScheduledTask_ID = notificationUser.ScheduledTask_ID // Assuming ScheduledTask_ID maps to ScheduledActivity_ID in your model
                };

                // Add the activity to the database using ICRUDRepository
                iCRUDRepository.Add(notificationUser);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(notificationUser);
            }
            catch (Exception)
            {
                //Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the activity.");
            }
        }

        [HttpPost]
        [Route("AddNotificationAdmin")]
        public async Task<IActionResult> AddNotificationAdmin(NotificationAdmin notificationAdmin)
        {
            try
            {
                // Validate the input data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Create the NotificationAdmin entity from the view model
                var newNotificationAdmin = new NotificationAdmin
                {
                    Date = notificationAdmin.Date,
                    User_ID = notificationAdmin.User_ID,
                    Notification_Message = notificationAdmin.Notification_Message,
                    NotificationStatus_ID = notificationAdmin.NotificationStatus_ID,
                    ScheduledActivity_ID = notificationAdmin.ScheduledActivity_ID,
                };

                // Add the notification to the database using ICRUDRepository
                iCRUDRepository.Add(newNotificationAdmin);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(newNotificationAdmin);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the notification.");
            }
        }

    }
}