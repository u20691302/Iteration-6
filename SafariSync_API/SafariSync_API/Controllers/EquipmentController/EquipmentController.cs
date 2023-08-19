using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SafariSync_API.Data;
using SafariSync_API.Models.EquipmentModel;
using SafariSync_API.Repositories.CRUD;
using SafariSync_API.ViewModels.EquipmentViewModel;

namespace SafariSync_API.Controllers.EquipmentController
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentController : ControllerBase
    {
        // Dependency injection of ICRUDRepository and SafariSyncDBContext
        private readonly ICRUDRepository iCRUDRepository;

        private readonly SafariSyncDBContext safariSyncDBContext;

        // Constructor to inject the dependencies
        public EquipmentController(ICRUDRepository crudRepository, SafariSyncDBContext SafariSyncDBContext)
        {
            iCRUDRepository = crudRepository;
            safariSyncDBContext = SafariSyncDBContext;
        }

        [HttpPost]
        [Route("AddEquipment")]
        public async Task<IActionResult> AddEquipment(EquipmentViewModel equipmentViewModel)
        {
            try
            {
                // Validate the input equipment data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Create the Equipment entity from the view model
                var equipment = new Equipment
                {
                    Equipment_Name = equipmentViewModel.Equipment_Name,
                    Equipment_Description = equipmentViewModel.Equipment_Description,
                    Equipment_Quantity_On_Hand = equipmentViewModel.Equipment_Quantity_On_Hand,
                    Equipment_Low_Level_Warning = equipmentViewModel.Equipment_Low_Level_Warning
                };

                // Add the equipment to the database using ICRUDRepository
                iCRUDRepository.Add(equipment);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Create associated EquipmentSupplier records
                foreach (var supplier in equipmentViewModel.Suppliers)
                {
                    var equipmentSupplier = new EquipmentSupplier
                    {
                        Equipment_ID = equipment.Equipment_ID,
                        Supplier_ID = supplier.Supplier_ID
                    };
                    // Add the equipmentsupplier to the database using ICRUDRepository
                    iCRUDRepository.Add(equipmentSupplier);
                }
                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(equipment);
            }
            catch (Exception)
            {
                //Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the equipment.");
            }
        }

        [HttpGet]
        [Route("ReadAllEquipmentAsync")]
        public async Task<IActionResult> ReadAllEquipmentAsync()
        {
            try
            {
                // Fetch all equipment using the ICRUDRepository
                var equipment = await iCRUDRepository.ReadAllAsync<Equipment>();

                // Fetch the associated suppliers using eager loading
                var equipmentIds = equipment.Select(e => e.Equipment_ID).ToList();
                var equipmentSuppliers = await safariSyncDBContext.EquipmentSupplier
                    .Where(es => equipmentIds.Contains(es.Equipment_ID))
                    .Include(es => es.Supplier!)
                    .ThenInclude(est => est.SupplierType)
                    .ToListAsync();

                // Populate the EquipmentSupplier property for each equipment item
                foreach (var item in equipment)
                {
                    // Filter the equipmentSuppliers list for the current equipment item
                    var suppliersForEquipment = equipmentSuppliers
                        .Where(es => es.Equipment_ID == item.Equipment_ID)
                        .ToList();

                    // Assign the filtered list to the EquipmentSupplier property of the current equipment item
                    item.EquipmentSupplier = suppliersForEquipment;
                }

                // Return the equipment data with associated suppliers
                return Ok(equipment);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching equipment data.");
            }
        }

        [HttpGet]
        [Route("ReadOneEquipmentAsync/{id}")]
        public async Task<IActionResult> ReadOneEquipmentByIdAsync(int id)
        {
            try
            {
                // Fetch the equipment by ID using SafariSyncDBContext with eager loading of EquipmentSupplier and Supplier
                var equipment = await safariSyncDBContext.Equipment
                    .Include(e => e.EquipmentSupplier)
                    .ThenInclude(es => es.Supplier!)
                    .ThenInclude(est => est.SupplierType)
                    .FirstOrDefaultAsync(e => e.Equipment_ID == id);

                // If equipment with the given ID is not found, return a not found response
                if (equipment == null)
                    return NotFound();

                // Return the equipment data with associated suppliers
                return Ok(equipment);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching equipment data.");
            }
        }

        [HttpPut]
        [Route("UpdateEquipmentAsync")]
        public async Task<IActionResult> UpdateEquipmentAsync(EquipmentViewModel equipmentViewModel)
        {
            try
            {
                // Validate the input equipment data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Fetch the existing equipment by ID using SafariSyncDBContext
                var existingEquipment = await safariSyncDBContext.Equipment
                    .Include(e => e.EquipmentSupplier)
                    .FirstOrDefaultAsync(e => e.Equipment_ID == equipmentViewModel.Equipment_ID);

                // If equipment with the given ID is not found, return a not found response
                if (existingEquipment == null)
                {
                    return NotFound();
                }

                // Update the Equipment entity from the view model
                existingEquipment.Equipment_Name = equipmentViewModel.Equipment_Name;
                existingEquipment.Equipment_Description = equipmentViewModel.Equipment_Description;
                existingEquipment.Equipment_Quantity_On_Hand = equipmentViewModel.Equipment_Quantity_On_Hand;
                existingEquipment.Equipment_Low_Level_Warning = equipmentViewModel.Equipment_Low_Level_Warning;

                // Remove existing EquipmentSupplier records associated with this equipment
                foreach (var existingSupplier in existingEquipment.EquipmentSupplier.ToList())
                {
                    existingEquipment.EquipmentSupplier.Remove(existingSupplier);
                }

                // Create new associated EquipmentSupplier records
                foreach (var supplier in equipmentViewModel.Suppliers)
                {
                    var equipmentSupplier = new EquipmentSupplier
                    {
                        Equipment_ID = existingEquipment.Equipment_ID,
                        Supplier_ID = supplier.Supplier_ID
                    };
                    existingEquipment.EquipmentSupplier.Add(equipmentSupplier);
                }

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(existingEquipment);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the equipment.");
            }
        }

        [HttpDelete]
        [Route("DeleteEquipment/{id}")]
        public async Task<IActionResult> DeleteEquipment(int id)
        {
            try
            {
                // Fetch the existing equipment by ID using SafariSyncDBContext
                var existingEquipment = await safariSyncDBContext.Equipment.Include(e => e.EquipmentSupplier).FirstOrDefaultAsync(e => e.Equipment_ID == id);

                // If equipment with the given ID is not found, return a not found response
                if (existingEquipment == null)
                {
                    return NotFound();
                }

                // Remove the equipment from the database using ICRUDRepository
                iCRUDRepository.Delete(existingEquipment);

                // Remove the associated EquipmentSupplier records from the database using ICRUDRepository
                foreach (var supplier in existingEquipment.EquipmentSupplier.ToList())
                {
                    iCRUDRepository.Delete(supplier);
                }

                try
                {
                    // Save changes asynchronously in the context
                    await safariSyncDBContext.SaveChangesAsync();

                    // Return the successful response
                    return Ok(existingEquipment);
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
                        return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the equipment.");
                    }
                }
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the equipment.");
            }
        }

        [HttpGet]
        [Route("ReadOneEquipmentSupplierAsync/{id}")]
        public async Task<IActionResult> ReadOneEquipmentSupplierByIdAsync(int id)
        {
            try
            {
                // Fetch the equipment by ID using SafariSyncDBContext with eager loading of EquipmentSupplier and Supplier
                var equipmentSupplier = await safariSyncDBContext.EquipmentSupplier
                    .Include(e => e.Supplier!)
                    .ThenInclude(es => es.SupplierType)
                    .FirstOrDefaultAsync(e => e.EquipmentSupplier_ID == id);

                // If equipment with the given ID is not found, return a not found response
                if (equipmentSupplier == null)
                    return NotFound();

                // Return the equipment data with associated suppliers
                return Ok(equipmentSupplier);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching equipment data.");
            }
        }

        [HttpDelete]
        [Route("DeleteEquipmentSupplier/{equipmentSupplierID}")]
        public async Task<IActionResult> DeleteEquipmentSupplier(int equipmentSupplierID)
        {
            try
            {
                // Retrieve the existing supplier from the CRUD repository based on the supplierID
                var equipmentSupplier = await iCRUDRepository.ReadOneAsync<EquipmentSupplier>(equipmentSupplierID);

                // If the existing supplier is not found, return a NotFound response with an appropriate message
                if (equipmentSupplier == null)
                    return NotFound("The supplier does not exist");

                // Retrieve the Equipment ID of the equipment associated with this EquipmentSupplier record
                int equipmentID = equipmentSupplier.Equipment_ID;

                // Check if this is the last EquipmentSupplier record for the associated Equipment ID
                bool isLastSupplierForEquipment = await IsLastSupplierForEquipment(equipmentID, equipmentSupplierID);

                // If this is the last supplier for the associated equipment, return a BadRequest response
                if (isLastSupplierForEquipment)
                    return BadRequest("The equipment must have at least one supplier.");

                // Delete the supplier from the CRUD repository
                iCRUDRepository.Delete(equipmentSupplier);

                // Save changes asynchronously in the CRUD repository and check if the operation succeeds
                if (await iCRUDRepository.SaveChangesAsync())
                    return Ok(equipmentSupplier);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }

            // Return a BadRequest response if the request is invalid
            return BadRequest("Your request is invalid.");
        }

        private async Task<bool> IsLastSupplierForEquipment(int equipmentID, int equipmentSupplierID)
        {
            // Retrieve the total number of suppliers associated with the given equipmentID
            int totalSupplierCount = await safariSyncDBContext.EquipmentSupplier
                .Where(es => es.Equipment_ID == equipmentID)
                .CountAsync();

            // Retrieve the number of suppliers for the equipment excluding the selected record
            int supplierCount = await safariSyncDBContext.EquipmentSupplier
                .Where(es => es.Equipment_ID == equipmentID && es.EquipmentSupplier_ID != equipmentSupplierID)
                .CountAsync();

            // Return true if the supplierCount is equal to the total count minus one, indicating this is the last supplier for the equipment
            return totalSupplierCount < 2;
        }
    }
}