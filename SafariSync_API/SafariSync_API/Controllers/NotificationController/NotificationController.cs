using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SafariSync_API.Data;
using SafariSync_API.Models.NotificationModel;
using SafariSync_API.Repositories.CRUD;

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
                var scheduledActivity = await safariSyncDBContext.NotificationSupervisor.Include(e => e.NotificationStatus)
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
                var scheduledActivity = await safariSyncDBContext.NotificationUser.Include(e => e.NotificationStatus)
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
                var scheduledActivity = await safariSyncDBContext.NotificationAdmin.Include(e => e.NotificationStatus).Include(e => e.ScheduledTask)
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
                    ScheduledTask_ID = notificationUser.ScheduledTask_ID,
                    ScheduledActivity_ID = notificationUser.ScheduledActivity_ID,
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
            //try
            //{
            // Validate the input data if necessary
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Create the NotificationAdmin entity from the view model
            var newNotificationAdmin = new NotificationAdmin
            {
                Date = notificationAdmin.Date,
                Notification_Message = notificationAdmin.Notification_Message,
                NotificationStatus_ID = notificationAdmin.NotificationStatus_ID,
                ScheduledTask_ID = notificationAdmin.ScheduledTask_ID,
                Contractor_ID = notificationAdmin.Contractor_ID,
                ScheduledActivity_ID = notificationAdmin.ScheduledActivity_ID
            };

            // Add the notification to the database using ICRUDRepository
            iCRUDRepository.Add(newNotificationAdmin);

            // Save changes asynchronously in the CRUD repository
            await iCRUDRepository.SaveChangesAsync();

            // Return the successful response
            return Ok(newNotificationAdmin);
            //}
            //catch (Exception)
            //{
            //    // Handle the exception and return an error response
            //    return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the notification.");
            //}
        }

        [HttpDelete]
        [Route("DeleteUserNotification/{user_ID}/{scheduledTask_ID}")]
        public async Task<IActionResult> DeleteUserNotification(int user_ID, int scheduledTask_ID)
        {
            try
            {
                var Notification = await safariSyncDBContext.NotificationUser
                    .FirstOrDefaultAsync(e => e.User_ID == user_ID && e.ScheduledTask_ID == scheduledTask_ID);

                // If the existing notification is not found, return a NotFound response with an appropriate message
                if (Notification == null)
                    return NotFound("The notification does not exist");

                // Delete the notification from the CRUD repository
                iCRUDRepository.Delete(Notification);

                // Save changes asynchronously in the context
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(Notification);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpDelete]
        [Route("DeleteAdminNotification/{contractor_ID}/{scheduledTask_ID}")]
        public async Task<IActionResult> DeleteAdminNotification(int contractor_ID, int scheduledTask_ID)
        {
            try
            {
                var Notification = await safariSyncDBContext.NotificationAdmin
                    .FirstOrDefaultAsync(e => e.Contractor_ID == contractor_ID && e.ScheduledTask_ID == scheduledTask_ID);

                // If the existing notification is not found, return a NotFound response with an appropriate message
                if (Notification == null)
                    return NotFound("The notification does not exist");

                // Delete the notification from the CRUD repository
                iCRUDRepository.Delete(Notification);

                // Save changes asynchronously in the context
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(Notification);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdateNotificationSupervisor")]
        public async Task<IActionResult> UpdateNotificationSupervisor(NotificationSupervisor notificationSupervisor)
        {
            try
            {
                // Validate the input data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var Notification = await safariSyncDBContext.NotificationSupervisor.FirstOrDefaultAsync(e => e.ScheduledActivity_ID == notificationSupervisor.ScheduledActivity_ID);

                // Check if the entity exists
                if (Notification == null)
                {
                    return NotFound("Notification not found");
                }

                // Update the properties of the existing entity with the new values
                Notification.Date = notificationSupervisor.Date;
                Notification.User_ID = notificationSupervisor.User_ID;
                Notification.Notification_Message = notificationSupervisor.Notification_Message;
                Notification.NotificationStatus_ID = notificationSupervisor.NotificationStatus_ID;
                Notification.ScheduledActivity_ID = notificationSupervisor.ScheduledActivity_ID;

                // Update the entity in the database
                iCRUDRepository.Update(Notification);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response with the updated entity
                return Ok(Notification);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the notification.");
            }
        }

        [HttpPut]
        [Route("UpdateNotificationAdmin")]
        public async Task<IActionResult> UpdateNotificationAdmin(NotificationAdmin notificationAdmin)
        {
            try
            {
                // Validate the input data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var Notification = await safariSyncDBContext.NotificationAdmin.FirstOrDefaultAsync(e => e.Contractor_ID == notificationAdmin.Contractor_ID && e.ScheduledTask_ID == notificationAdmin.ScheduledTask_ID);

                // Check if the entity exists
                if (Notification == null)
                {
                    return NotFound("Notification not found");
                }

                // Update the properties of the existing entity with the new values
                Notification.Date = notificationAdmin.Date;
                Notification.Contractor_ID = notificationAdmin.Contractor_ID;
                Notification.Notification_Message = notificationAdmin.Notification_Message;
                Notification.NotificationStatus_ID = notificationAdmin.NotificationStatus_ID;
                Notification.ScheduledTask_ID = notificationAdmin.ScheduledTask_ID;

                // Update the entity in the database
                iCRUDRepository.Update(Notification);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response with the updated entity
                return Ok(Notification);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the notification.");
            }
        }

        [HttpPut]
        [Route("UpdateNotificationUser")]
        public async Task<IActionResult> UpdateNotificationUser(NotificationUser notificationUser)
        {
            try
            {
                // Validate the input data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var Notification = await safariSyncDBContext.NotificationUser.FirstOrDefaultAsync(e => e.User_ID == notificationUser.User_ID && e.ScheduledTask_ID == notificationUser.ScheduledTask_ID);

                // Check if the entity exists
                if (Notification == null)
                {
                    return NotFound("Notification not found");
                }

                // Update the properties of the existing entity with the new values
                Notification.Date = notificationUser.Date;
                Notification.User_ID = notificationUser.User_ID;
                Notification.Notification_Message = notificationUser.Notification_Message;
                Notification.NotificationStatus_ID = notificationUser.NotificationStatus_ID;
                Notification.ScheduledTask_ID = notificationUser.ScheduledTask_ID;

                // Update the entity in the database
                iCRUDRepository.Update(Notification);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response with the updated entity
                return Ok(Notification);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the notification.");
            }
        }

        [HttpPut]
        [Route("UpdateNotificationSupervisorStatus")]
        public async Task<IActionResult> UpdateNotificationSupervisorStatus(NotificationSupervisor notificationSupervisor)
        {
            //try
            //{
            // Validate the input data if necessary
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var Notification = await safariSyncDBContext.NotificationSupervisor.FirstOrDefaultAsync(e => e.Notification_ID == notificationSupervisor.Notification_ID);

            // Check if the entity exists
            if (Notification == null)
            {
                return NotFound("Notification not found");
            }

            // Update the properties of the existing entity with the new values
            Notification.NotificationStatus_ID = notificationSupervisor.NotificationStatus_ID;

            // Update the entity in the database
            iCRUDRepository.Update(Notification);

            // Save changes asynchronously in the CRUD repository
            await iCRUDRepository.SaveChangesAsync();

            // Return the successful response with the updated entity
            return Ok(Notification);
            //}
            //catch (Exception)
            //{
            //    // Handle the exception and return an error response
            //    return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the notification.");
            //}
        }

        [HttpPut]
        [Route("UpdateNotificationUserStatus")]
        public async Task<IActionResult> UpdateNotificationUserStatus(NotificationUser notificationUser)
        {
            //try
            //{
            // Validate the input data if necessary
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var Notification = await safariSyncDBContext.NotificationUser.FirstOrDefaultAsync(e => e.Notification_ID == notificationUser.Notification_ID);

            // Check if the entity exists
            if (Notification == null)
            {
                return NotFound("Notification not found");
            }

            // Update the properties of the existing entity with the new values
            Notification.NotificationStatus_ID = notificationUser.NotificationStatus_ID;

            // Update the entity in the database
            iCRUDRepository.Update(Notification);

            // Save changes asynchronously in the CRUD repository
            await iCRUDRepository.SaveChangesAsync();

            // Return the successful response with the updated entity
            return Ok(Notification);
            //}
            //catch (Exception)
            //{
            //    //Handle the exception and return an error response
            //    return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the notification.");
            //}
        }

        [HttpPut]
        [Route("UpdateNotificationAdminStatus")]
        public async Task<IActionResult> UpdateNotificationAdminStatus(NotificationAdmin notificationAdmin)
        {
            //try
            //{
            // Validate the input data if necessary
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var Notification = await safariSyncDBContext.NotificationAdmin.FirstOrDefaultAsync(e => e.Notification_ID == notificationAdmin.Notification_ID);

            // Check if the entity exists
            if (Notification == null)
            {
                return NotFound("Notification not found");
            }

            // Update the properties of the existing entity with the new values
            Notification.NotificationStatus_ID = notificationAdmin.NotificationStatus_ID;

            // Update the entity in the database
            iCRUDRepository.Update(Notification);

            // Save changes asynchronously in the CRUD repository
            await iCRUDRepository.SaveChangesAsync();

            // Return the successful response with the updated entity
            return Ok(Notification);
            //}
            //catch (Exception)
            //{
            //    //Handle the exception and return an error response
            //    return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the notification.");
            //}
        }
    }
}