using Microsoft.AspNetCore.Mvc;
using SafariSync_API.Data;
using SafariSync_API.Models.RatingSettings;
using SafariSync_API.Repositories.CRUD;
using SafariSync_API.ViewModels.RatingSettingsViewModel;
using SafariSync_API.ViewModels.SkillsViewModel;

namespace SafariSync_API.Controllers.Dashboard
{
    // Specifies that the class is an API controller
    [ApiController]
    // Defines the route for the controller
    [Route("/api/[controller]")]
    public class DashboardController : Controller
    {
        // Declaration of a private read-only field of type ICRUDRepository.
        private readonly ICRUDRepository iCRUDRepository;

        private readonly SafariSyncDBContext safariSyncDBContext;

        // Constructor for the SkillController class, which takes an argument of type ICRUDRepository.
        public DashboardController(ICRUDRepository crudRepository, SafariSyncDBContext SafariSyncDBContext)
        {
            // Assigns the value of the argument to the iCRUDRepository field.
            iCRUDRepository = crudRepository;
            safariSyncDBContext = SafariSyncDBContext;
        }

        [HttpPut]
        [Route("UpdateRatingAsync/{RatingID}")]
        public async Task<ActionResult<SkillsViewModel>> UpdateRatingAsync(int RatingID, RatingsSettingsViewModel svm)
        {
            try
            {
                // Retrieve the existing skill from the CRUD repository based on the SkillID
                var existingRating = await iCRUDRepository.ReadOneAsync<RatingSettings>(RatingID);

                // If the existing skill is not found, return a NotFound response with an appropriate message
                if (existingRating == null)
                    return NotFound("The rating setting does not exist");

                // Update the properties of the existing skill with the values from the SkillViewModel
                existingRating.RatingSettings_Upper = svm.RatingSettings_Upper;
                existingRating.RatingSettings_Lower = svm.RatingSettings_Lower;

                // Update the skill in the CRUD repository
                iCRUDRepository.Update(existingRating);

                // Save changes asynchronously in the CRUD repository and check if the operation succeeds
                if (await iCRUDRepository.SaveChangesAsync())
                {
                    // Return an Ok response with the updated skill
                    return Ok(existingRating);
                }
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }

            // Return a BadRequest response if the request is invalid
            return BadRequest("Your request is invalid.");
        }

        [HttpGet]
        [Route("ReadAllRatingsAsync")]
        public async Task<IActionResult> ReadAllRatingsAsync()
        {
            try
            {
                // Retrieve all skills asynchronously from the CRUD repository
                var results = await iCRUDRepository.ReadAllAsync<RatingSettings>();

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