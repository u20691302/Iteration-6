using Microsoft.AspNetCore.Mvc;
using SafariSync_API.Models.ContractorModel;
using SafariSync_API.Repositories.CRUD;
using SafariSync_API.ViewModels.ContractorViewModel;

namespace SafariSync_API.Controllers.ContractorController
{
    // Specifies that the class is an API controller
    [ApiController]
    // Defines the route for the controller
    [Route("/api/[controller]")]
    public class ContractorController : ControllerBase
    {
        // Declaration of a private read-only field of type ICRUDRepository.
        private readonly ICRUDRepository iCRUDRepository;

        // Constructor for the ContractorController class, which takes an argument of type ICRUDRepository.
        public ContractorController(ICRUDRepository crudRepository)
        {
            // Assigns the value of the argument to the iCRUDRepository field.
            iCRUDRepository = crudRepository;
        }

        [HttpPost]
        [Route("AddContractor")]
        public async Task<IActionResult> AddContractor(ContractorViewModel svm)
        {
            try
            {
                // Retrieve all ContractorType entities from the CRUD repository
                var contractorTypes = await iCRUDRepository.ReadAllAsync<ContractorType>();

                // Find the ContractorType by name
                var matchingContractorType = contractorTypes.FirstOrDefault(st => st.ContractorType_ID == svm.ContractorType_ID);

                // If the ContractorType is not found, return a BadRequest response with an appropriate message
                if (matchingContractorType == null)
                    return BadRequest("Contractor type does not exist");

                // Create a new Contractor object using data from the ContractorViewModel
                var contractor = new Contractor
                {
                    Contractor_Name = svm.Contractor_Name,
                    Contractor_Phone_Number = svm.Contractor_Phone_Number,
                    Contractor_Email_Address = svm.Contractor_Email_Address,
                    Contractor_Address = svm.Contractor_Address,
                    ContractorType_ID = matchingContractorType.ContractorType_ID
                };

                // Add the contractor to the CRUD repository
                iCRUDRepository.Add(contractor);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return an Ok response with the added contractor
                return Ok(contractor);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the transaction
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("ReadAllContractorsAsync")]
        public async Task<IActionResult> ReadAllContractorsAsync()
        {
            try
            {
                // Retrieve all contractors asynchronously from the CRUD repository
                var results = await iCRUDRepository.ReadAllAsync<Contractor>();

                // Include the ContractorType for each contractor
                foreach (var contractor in results)
                {
                    contractor.ContractorType = await iCRUDRepository.ReadOneAsync<ContractorType>(contractor.ContractorType_ID);
                }

                // Order the contractors in alphabetical order
                results = results.OrderBy(contractor => contractor.Contractor_Name).ToArray();

                // Return an Ok response with the retrieved contractors
                return Ok(results);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("ReadAllContractorTypesAsync")]
        public async Task<IActionResult> ReadAllContractorTypesAsync()
        {
            try
            {
                // Retrieve all contractorTypes asynchronously from the CRUD repository
                var results = await iCRUDRepository.ReadAllAsync<ContractorType>();

                // Order the contractorTypes in alphabetical order
                results = results.OrderBy(contractorType => contractorType.ContractorType_Name).ToArray();

                // Return an Ok response with the retrieved contractorTypes
                return Ok(results);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("ReadOneContractorAsync/{contractorID}")]
        public async Task<IActionResult> ReadOneContractorAsync(int contractorID)
        {
            try
            {
                // Retrieve a single contractor asynchronously from the CRUD repository based on the contractorID
                var result = await iCRUDRepository.ReadOneAsync<Contractor>(contractorID);

                // If the result is null, return a NotFound response with an appropriate message
                if (result == null)
                    return NotFound("Contractor does not exist. You need to create it first");

                // Include the ContractorType for the contractor
                result.ContractorType = await iCRUDRepository.ReadOneAsync<ContractorType>(result.ContractorType_ID);

                // Return an Ok response with the retrieved contractor
                return Ok(result);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdateContractorAsync/{ContractorID}")]
        public async Task<ActionResult<ContractorViewModel>> UpdateContractor(int ContractorID, ContractorViewModel svm)
        {
            try
            {
                // Retrieve the existing contractor from the CRUD repository based on the ContractorID
                var existingContractor = await iCRUDRepository.ReadOneAsync<Contractor>(ContractorID);

                // If the existing contractor is not found, return a NotFound response with an appropriate message
                if (existingContractor == null)
                    return NotFound("The contractor does not exist");

                // Retrieve all ContractorTypes from the CRUD repository
                var contractorTypes = await iCRUDRepository.ReadAllAsync<ContractorType>();

                // Retrieve the ContractorType by name from the list of ContractorTypes using LINQ
                var contractorType = contractorTypes.FirstOrDefault(st => st.ContractorType_ID == svm.ContractorType_ID);

                // If the ContractorType is not found, return a BadRequest response with an appropriate message
                if (contractorType == null)
                    return BadRequest("Contractor type does not exist");

                // Update the properties of the existing contractor with the values from the ContractorViewModel
                existingContractor.Contractor_Name = svm.Contractor_Name;
                existingContractor.Contractor_Phone_Number = svm.Contractor_Phone_Number;
                existingContractor.Contractor_Email_Address = svm.Contractor_Email_Address;
                existingContractor.Contractor_Address = svm.Contractor_Address;
                existingContractor.ContractorType_ID = contractorType.ContractorType_ID;

                // Update the contractor in the CRUD repository
                iCRUDRepository.Update(existingContractor);

                // Save changes asynchronously in the CRUD repository and check if the operation succeeds
                if (await iCRUDRepository.SaveChangesAsync())
                {
                    // Return an Ok response with the updated contractor
                    return Ok(existingContractor);
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
        [Route("DeleteContractor/{contractorID}")]
        public async Task<IActionResult> DeleteContractor(int contractorID)
        {
            try
            {
                // Retrieve the existing contractor from the CRUD repository based on the contractorID
                var existingContractor = await iCRUDRepository.ReadOneAsync<Contractor>(contractorID);

                // If the existing contractor is not found, return a NotFound response with an appropriate message
                if (existingContractor == null)
                    return NotFound("The contractor does not exist");

                // Delete the contractor from the CRUD repository
                iCRUDRepository.Delete(existingContractor);

                // Save changes asynchronously in the CRUD repository and check if the operation succeeds
                if (await iCRUDRepository.SaveChangesAsync())
                    return Ok(existingContractor);
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