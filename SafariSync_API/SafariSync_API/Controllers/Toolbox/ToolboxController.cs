using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SafariSync_API.Data;
using SafariSync_API.Models.ToolboxModel;
using SafariSync_API.Repositories.CRUD;
using SafariSync_API.ViewModels.Toolbox;

namespace SafariSync_API.Controllers.ToolboxController
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToolboxController : ControllerBase
    {
        // Dependency injection of ICRUDRepository and SafariSyncDBContext
        private readonly ICRUDRepository iCRUDRepository;

        private readonly SafariSyncDBContext safariSyncDBContext;

        // Constructor to inject the dependencies
        public ToolboxController(ICRUDRepository crudRepository, SafariSyncDBContext SafariSyncDBContext)
        {
            iCRUDRepository = crudRepository;
            safariSyncDBContext = SafariSyncDBContext;
        }

        [HttpPost]
        [Route("AddToolbox")]
        public async Task<IActionResult> AddToolbox(ToolboxViewModel toolboxViewModel)
        {
            try
            {
                // Validate the input toolbox data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Create the Toolbox entity from the view model
                var toolbox = new Toolbox
                {
                    Toolbox_Name = toolboxViewModel.Toolbox_Name,
                    Toolbox_Description = toolboxViewModel.Toolbox_Description,
                };

                // Add the toolbox to the database using ICRUDRepository
                iCRUDRepository.Add(toolbox);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(toolbox);
            }
            catch (Exception)
            {
                //Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the toolbox.");
            }
        }

        [HttpGet]
        [Route("ReadAllToolboxAsync")]
        public async Task<IActionResult> ReadAllToolboxAsync()
        {
            try
            {
                var existingToolbox = await safariSyncDBContext.Toolbox
                .Include(tb => tb.ToolboxEquipment).ThenInclude(tb => tb.Equipment)
                .Include(tb => tb.ToolboxStock).ThenInclude(tb => tb.Stock)
                .ToListAsync();

                if (existingToolbox == null)
                    return NotFound();

                // Return the toolbox data with associated equipments
                return Ok(existingToolbox);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching toolbox data.");
            }
        }

        [HttpGet]
        [Route("ReadOneToolboxAsync/{id}")]
        public async Task<IActionResult> ReadOneToolboxByIdAsync(int id)
        {
            try
            {
                // Fetch the toolbox by ID using SafariSyncDBContext with eager loading of ToolboxTask and Task
                var toolbox = await safariSyncDBContext.Toolbox
                    .Include(tb => tb.ToolboxEquipment).ThenInclude(tb => tb.Equipment)
                    .Include(tb => tb.ToolboxStock).ThenInclude(tb => tb.Stock)
                    .FirstOrDefaultAsync(tb => tb.Toolbox_ID == id);

                // If toolbox with the given ID is not found, return a not found response
                if (toolbox == null)
                    return NotFound();

                // Return the toolbox data with associated equipments
                return Ok(toolbox);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching toolbox data.");
            }
        }

        [HttpPut]
        [Route("UpdateToolboxAsync")]
        public async Task<IActionResult> UpdateToolboxAsync(ToolboxViewModel toolboxViewModel)
        {
            try
            {
                // Validate the input toolbox data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Fetch the existing toolbox by ID using SafariSyncDBContext
                var existingToolbox = await safariSyncDBContext.Toolbox
                    .FirstOrDefaultAsync(e => e.Toolbox_ID == toolboxViewModel.Toolbox_ID);

                // If toolbox with the given ID is not found, return a not found response
                if (existingToolbox == null)
                {
                    return NotFound();
                }

                // Update the Toolbox entity from the view model
                existingToolbox.Toolbox_Name = toolboxViewModel.Toolbox_Name;
                existingToolbox.Toolbox_Description = toolboxViewModel.Toolbox_Description;

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(existingToolbox);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the toolbox.");
            }
        }

        [HttpDelete]
        [Route("DeleteToolbox/{id}")]
        public async Task<IActionResult> DeleteToolbox(int id)
        {
            try
            {
                // Fetch the existing toolbox by ID including its associated ToolboxEquipment and ToolboxStock records
                var existingToolbox = await safariSyncDBContext.Toolbox
                    .Include(tb => tb.ToolboxEquipment)
                    .Include(tb => tb.ToolboxStock)
                    .FirstOrDefaultAsync(tb => tb.Toolbox_ID == id);

                // If toolbox with the given ID is not found, return a not found response
                if (existingToolbox == null)
                {
                    return NotFound();
                }

                // Remove the associated toolboxEquipment records from the database
                safariSyncDBContext.ToolboxEquipment.RemoveRange(existingToolbox.ToolboxEquipment);

                // Remove the associated toolboxStock records from the database
                safariSyncDBContext.ToolboxStock.RemoveRange(existingToolbox.ToolboxStock);

                // Remove the toolbox from the database
                safariSyncDBContext.Toolbox.Remove(existingToolbox);

                try
                {
                    // Save changes asynchronously in the context
                    await safariSyncDBContext.SaveChangesAsync();

                    // Return the successful response
                    return Ok(existingToolbox);
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
                        return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the toolbox.");
                    }
                }
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the toolbox.");
            }
        }

        [HttpGet]
        [Route("ReadOneToolboxEquipmentAsync/{id}")]
        public async Task<IActionResult> ReadOneToolboxEquipmentAsync(int id)
        {
            try
            {
                // Fetch the toolbox by ID using SafariSyncDBContext with eager loading of ToolboxTask and Task
                var toolboxEquipment = await safariSyncDBContext.ToolboxEquipment.Include(tb => tb.Equipment)
                    .FirstOrDefaultAsync(tb => tb.ToolboxEquipment_ID == id);

                // If toolbox with the given ID is not found, return a not found response
                if (toolboxEquipment == null)
                    return NotFound();

                // Return the toolbox data with associated equipments
                return Ok(toolboxEquipment);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching toolbox equipment data.");
            }
        }

        [HttpGet]
        [Route("ReadOneToolboxStockAsync/{id}")]
        public async Task<IActionResult> ReadOneToolboxStockAsync(int id)
        {
            try
            {
                // Fetch the toolbox by ID using SafariSyncDBContext with eager loading of ToolboxTask and Task
                var toolboxStock = await safariSyncDBContext.ToolboxStock.Include(tb => tb.Stock)
                    .FirstOrDefaultAsync(tb => tb.ToolboxStock_ID == id);

                // If toolbox with the given ID is not found, return a not found response
                if (toolboxStock == null)
                    return NotFound();

                // Return the toolbox data with associated equipments
                return Ok(toolboxStock);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching toolbox stock data.");
            }
        }

        [HttpDelete]
        [Route("DeleteToolboxEquipment/{id}")]
        public async Task<IActionResult> DeleteToolboxEquipment(int id)
        {
            try
            {
                // Fetch the existing toolbox by ID including its associated ToolboxEquipment and ToolboxStock records
                var toolboxEquipment = await safariSyncDBContext.ToolboxEquipment
                    .FirstOrDefaultAsync(tb => tb.ToolboxEquipment_ID == id);

                // If toolbox with the given ID is not found, return a not found response
                if (toolboxEquipment == null)
                {
                    return NotFound();
                }

                // Remove the toolbox from the database
                safariSyncDBContext.ToolboxEquipment.Remove(toolboxEquipment);

                try
                {
                    // Save changes asynchronously in the context
                    await safariSyncDBContext.SaveChangesAsync();

                    // Return the successful response
                    return Ok(toolboxEquipment);
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
                        return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the toolbox.");
                    }
                }
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the toolbox equipment.");
            }
        }

        [HttpDelete]
        [Route("DeleteToolboxStock/{id}")]
        public async Task<IActionResult> DeleteToolboxStock(int id)
        {
            try
            {
                // Fetch the existing toolbox by ID including its associated ToolboxEquipment and ToolboxStock records
                var toolboxStock = await safariSyncDBContext.ToolboxStock
                    .FirstOrDefaultAsync(tb => tb.ToolboxStock_ID == id);

                // If toolbox with the given ID is not found, return a not found response
                if (toolboxStock == null)
                {
                    return NotFound();
                }

                // Remove the toolbox from the database
                safariSyncDBContext.ToolboxStock.Remove(toolboxStock);

                try
                {
                    // Save changes asynchronously in the context
                    await safariSyncDBContext.SaveChangesAsync();

                    // Return the successful response
                    return Ok(toolboxStock);
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
                        return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the toolbox.");
                    }
                }
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the toolbox stock.");
            }
        }

        [HttpPost]
        [Route("AddToolboxStock")]
        public async Task<IActionResult> AddToolboxStock(ToolboxStockViewModel toolboxStockViewModel)
        {
            try
            {
                // Validate the input toolbox data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Create the Toolbox entity from the view model
                var toolboxStock = new ToolboxStock
                {
                    Toolbox_ID = toolboxStockViewModel.Toolbox_ID,
                    Stock_ID = toolboxStockViewModel.Stock_ID,
                    Quantity = toolboxStockViewModel.Quantity
                };

                // Add the toolbox to the database using ICRUDRepository
                iCRUDRepository.Add(toolboxStock);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(toolboxStock);
            }
            catch (Exception)
            {
                //Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the toolbox.");
            }
        }

        [HttpPost]
        [Route("AddToolboxEquipment")]
        public async Task<IActionResult> AddToolboxEquipment(ToolboxEquipmentViewModel toolboxEquipmentViewModel)
        {
            try
            {
                // Validate the input toolbox data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Create the Toolbox entity from the view model
                var toolboxEquipment = new ToolboxEquipment
                {
                    Toolbox_ID = toolboxEquipmentViewModel.Toolbox_ID,
                    Equipment_ID = toolboxEquipmentViewModel.Equipment_ID,
                    Quantity = toolboxEquipmentViewModel.Quantity
                };

                // Add the toolbox to the database using ICRUDRepository
                iCRUDRepository.Add(toolboxEquipment);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(toolboxEquipment);
            }
            catch (Exception)
            {
                //Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the toolbox.");
            }
        }
    }
}