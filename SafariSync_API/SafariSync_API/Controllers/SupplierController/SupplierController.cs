using Microsoft.AspNetCore.Mvc;
using SafariSync_API.Models.SupplierModel;
using SafariSync_API.Repositories.CRUD;
using SafariSync_API.ViewModels.SupplierViewModel;

namespace SafariSync_API.Controllers.SupplierController
{
    // Specifies that the class is an API controller
    [ApiController]
    // Defines the route for the controller
    [Route("/api/[controller]")]
    public class SupplierController : ControllerBase
    {
        // Declaration of a private read-only field of type ICRUDRepository.
        private readonly ICRUDRepository iCRUDRepository;

        // Constructor for the SupplierController class, which takes an argument of type ICRUDRepository.
        public SupplierController(ICRUDRepository crudRepository)
        {
            // Assigns the value of the argument to the iCRUDRepository field.
            iCRUDRepository = crudRepository;
        }

        [HttpPost]
        [Route("AddSupplier")]
        public async Task<IActionResult> AddSupplier(SupplierViewModel svm)
        {
            try
            {
                // Retrieve all SupplierType entities from the CRUD repository
                var supplierTypes = await iCRUDRepository.ReadAllAsync<SupplierType>();

                // Find the SupplierType by name
                var matchingSupplierType = supplierTypes.FirstOrDefault(st => st.SupplierType_ID == svm.SupplierType_ID);

                // If the SupplierType is not found, return a BadRequest response with an appropriate message
                if (matchingSupplierType == null)
                    return BadRequest("Supplier type does not exist");

                // Create a new Supplier object using data from the SupplierViewModel
                var supplier = new Supplier
                {
                    Supplier_Name = svm.Supplier_Name,
                    Supplier_Phone_Number = svm.Supplier_Phone_Number,
                    Supplier_Email_Address = svm.Supplier_Email_Address,
                    Supplier_Address = svm.Supplier_Address,
                    SupplierType_ID = matchingSupplierType.SupplierType_ID
                };

                // Add the supplier to the CRUD repository
                iCRUDRepository.Add(supplier);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return an Ok response with the added supplier
                return Ok(supplier);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the transaction
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("ReadAllSuppliersAsync")]
        public async Task<IActionResult> ReadAllSuppliersAsync()
        {
            try
            {
                // Retrieve all suppliers asynchronously from the CRUD repository
                var results = await iCRUDRepository.ReadAllAsync<Supplier>();

                // Include the SupplierType for each supplier
                foreach (var supplier in results)
                {
                    supplier.SupplierType = await iCRUDRepository.ReadOneAsync<SupplierType>(supplier.SupplierType_ID);
                }

                // Order the suppliers in alphabetical order
                results = results.OrderBy(supplier => supplier.Supplier_Name).ToArray();

                // Return an Ok response with the retrieved suppliers
                return Ok(results);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("ReadAllSupplierTypesAsync")]
        public async Task<IActionResult> ReadAllSupplierTypesAsync()
        {
            try
            {
                // Retrieve all supplierTypes asynchronously from the CRUD repository
                var results = await iCRUDRepository.ReadAllAsync<SupplierType>();

                // Order the supplierTypes in alphabetical order
                results = results.OrderBy(supplierType => supplierType.SupplierType_Name).ToArray();

                // Return an Ok response with the retrieved supplierTypes
                return Ok(results);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("ReadOneSupplierAsync/{supplierID}")]
        public async Task<IActionResult> ReadOneSupplierAsync(int supplierID)
        {
            try
            {
                // Retrieve a single supplier asynchronously from the CRUD repository based on the supplierID
                var result = await iCRUDRepository.ReadOneAsync<Supplier>(supplierID);

                // If the result is null, return a NotFound response with an appropriate message
                if (result == null)
                    return NotFound("Supplier does not exist. You need to create it first");

                // Include the SupplierType for the supplier
                result.SupplierType = await iCRUDRepository.ReadOneAsync<SupplierType>(result.SupplierType_ID);

                // Return an Ok response with the retrieved supplier
                return Ok(result);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdateSupplierAsync/{SupplierID}")]
        public async Task<ActionResult<SupplierViewModel>> UpdateSupplier(int SupplierID, SupplierViewModel svm)
        {
            try
            {
                // Retrieve the existing supplier from the CRUD repository based on the SupplierID
                var existingSupplier = await iCRUDRepository.ReadOneAsync<Supplier>(SupplierID);

                // If the existing supplier is not found, return a NotFound response with an appropriate message
                if (existingSupplier == null)
                    return NotFound("The supplier does not exist");

                // Retrieve all SupplierTypes from the CRUD repository
                var supplierTypes = await iCRUDRepository.ReadAllAsync<SupplierType>();

                // Retrieve the SupplierType by name from the list of SupplierTypes using LINQ
                var supplierType = supplierTypes.FirstOrDefault(st => st.SupplierType_ID == svm.SupplierType_ID);

                // If the SupplierType is not found, return a BadRequest response with an appropriate message
                if (supplierType == null)
                    return BadRequest("Supplier type does not exist");

                // Update the properties of the existing supplier with the values from the SupplierViewModel
                existingSupplier.Supplier_Name = svm.Supplier_Name;
                existingSupplier.Supplier_Phone_Number = svm.Supplier_Phone_Number;
                existingSupplier.Supplier_Email_Address = svm.Supplier_Email_Address;
                existingSupplier.Supplier_Address = svm.Supplier_Address;
                existingSupplier.SupplierType_ID = supplierType.SupplierType_ID;

                // Update the supplier in the CRUD repository
                iCRUDRepository.Update(existingSupplier);

                // Save changes asynchronously in the CRUD repository and check if the operation succeeds
                if (await iCRUDRepository.SaveChangesAsync())
                {
                    // Return an Ok response with the updated supplier
                    return Ok(existingSupplier);
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
        [Route("DeleteSupplier/{supplierID}")]
        public async Task<IActionResult> DeleteSupplier(int supplierID)
        {
            try
            {
                // Retrieve the existing supplier from the CRUD repository based on the supplierID
                var existingSupplier = await iCRUDRepository.ReadOneAsync<Supplier>(supplierID);

                // If the existing supplier is not found, return a NotFound response with an appropriate message
                if (existingSupplier == null)
                    return NotFound("The supplier does not exist");

                // Delete the supplier from the CRUD repository
                iCRUDRepository.Delete(existingSupplier);

                // Save changes asynchronously in the CRUD repository and check if the operation succeeds
                if (await iCRUDRepository.SaveChangesAsync())
                    return Ok(existingSupplier);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }

            // Return a BadRequest response if the request is invalid
            return BadRequest("Your request is invalid.");
        }
    }
}