using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SafariSync_API.Models.SkillsModel;
using SafariSync_API.Repositories.CRUD;
using SafariSync_API.ViewModels.SkillsViewModel;

namespace SafariSync_API.Controllers.SkillController
{
    // Specifies that the class is an API controller
    [ApiController]
    // Defines the route for the controller
    [Route("/api/[controller]")]
    public class SkillController : ControllerBase
    {
        // Declaration of a private read-only field of type ICRUDRepository.
        private readonly ICRUDRepository iCRUDRepository;

        // Constructor for the SkillController class, which takes an argument of type ICRUDRepository.
        public SkillController(ICRUDRepository crudRepository)
        {
            // Assigns the value of the argument to the iCRUDRepository field.
            iCRUDRepository = crudRepository;
        }

        [HttpPost]
        [Route("AddSkill")]
        public async Task<IActionResult> AddSkill(SkillsViewModel svm)
        {
            try
            {
                // Create a new Skill object using data from the SkillViewModel
                var skill = new Skills
                {
                    Skill_Name = svm.Skill_Name,
                    Skill_Description = svm.Skill_Description,
                };

                // Add the skill to the CRUD repository
                iCRUDRepository.Add(skill);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return an Ok response with the added skill
                return Ok(skill);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the transaction
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("ReadAllSkillsAsync")]
        public async Task<IActionResult> ReadAllSkillsAsync()
        {
            try
            {
                // Retrieve all skills asynchronously from the CRUD repository
                var results = await iCRUDRepository.ReadAllAsync<Skills>();

                // Order the skills in alphabetical order
                results = results.OrderBy(skill => skill.Skill_Name).ToArray();

                // Return an Ok response with the retrieved skills
                return Ok(results);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("ReadOneSkillAsync/{skillID}")]
        public async Task<IActionResult> ReadOneSkillAsync(int skillID)
        {
            try
            {
                // Retrieve a single skill asynchronously from the CRUD repository based on the skillID
                var result = await iCRUDRepository.ReadOneAsync<Skills>(skillID);

                // If the result is null, return a NotFound response with an appropriate message
                if (result == null)
                    return NotFound("Skill does not exist. You need to create it first");

                // Return an Ok response with the retrieved skill
                return Ok(result);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdateSkillAsync/{SkillID}")]
        public async Task<ActionResult<SkillsViewModel>> UpdateSkill(int SkillID, SkillsViewModel svm)
        {
            try
            {
                // Retrieve the existing skill from the CRUD repository based on the SkillID
                var existingSkill = await iCRUDRepository.ReadOneAsync<Skills>(SkillID);

                // If the existing skill is not found, return a NotFound response with an appropriate message
                if (existingSkill == null)
                    return NotFound("The skill does not exist");

                // Update the properties of the existing skill with the values from the SkillViewModel
                existingSkill.Skill_Name = svm.Skill_Name;
                existingSkill.Skill_Description = svm.Skill_Description;

                // Update the skill in the CRUD repository
                iCRUDRepository.Update(existingSkill);

                // Save changes asynchronously in the CRUD repository and check if the operation succeeds
                if (await iCRUDRepository.SaveChangesAsync())
                {
                    // Return an Ok response with the updated skill
                    return Ok(existingSkill);
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

        [HttpDelete]
        [Route("DeleteSkill/{skillID}")]
        public async Task<IActionResult> DeleteSkill(int skillID)
        {
            try
            {
                // Retrieve the existing skill from the CRUD repository based on the skillID
                var existingSkill = await iCRUDRepository.ReadOneAsync<Skills>(skillID);

                // If the existing skill is not found, return a NotFound response with an appropriate message
                if (existingSkill == null)
                    return NotFound("The skill does not exist");

                // Delete the skill from the CRUD repository
                iCRUDRepository.Delete(existingSkill);

                // Save changes asynchronously in the context
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(existingSkill);
            }
            catch (DbUpdateException ex)
            {
                // Check if the exception is due to a foreign key violation
                if (ex.InnerException is SqlException sqlEx && sqlEx.Number == 547)
                {
                    // Return a 400 Bad Request status code indicating the foreign key violation
                    return BadRequest("Cannot delete the skill because it is associated with other entities.");
                }
                else
                {
                    // Return a StatusCode 500 response for any other DbUpdateException
                    return StatusCode(500, "Internal Server Error. Please contact support.");
                }
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
    }
}