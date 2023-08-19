using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SafariSync_API.Data;
using SafariSync_API.Models.StockModel;
using SafariSync_API.Repositories.CRUD;
using SafariSync_API.ViewModels.StockViewModel;

namespace SafariSync_API.Controllers.StockController
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockController : ControllerBase
    {
        // Dependency injection of ICRUDRepository and SafariSyncDBContext
        private readonly ICRUDRepository iCRUDRepository;

        private readonly SafariSyncDBContext safariSyncDBContext;

        // Constructor to inject the dependencies
        public StockController(ICRUDRepository crudRepository, SafariSyncDBContext SafariSyncDBContext)
        {
            iCRUDRepository = crudRepository;
            safariSyncDBContext = SafariSyncDBContext;
        }

        [HttpPost]
        [Route("AddStock")]
        public async Task<IActionResult> AddStock(StockViewModel stockViewModel)
        {
            try
            {
                // Validate the input stock data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Create the Stock entity from the view model
                var stock = new Stock
                {
                    Stock_Name = stockViewModel.Stock_Name,
                    Stock_Description = stockViewModel.Stock_Description,
                    Stock_Quantity_On_Hand = stockViewModel.Stock_Quantity_On_Hand,
                    Stock_Low_Level_Warning = stockViewModel.Stock_Low_Level_Warning
                };

                // Add the stock to the database using ICRUDRepository
                iCRUDRepository.Add(stock);

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Create associated StockSupplier records
                foreach (var supplier in stockViewModel.Suppliers)
                {
                    var stockSupplier = new StockSupplier
                    {
                        Stock_ID = stock.Stock_ID,
                        Supplier_ID = supplier.Supplier_ID
                    };
                    // Add the stocksupplier to the database using ICRUDRepository
                    iCRUDRepository.Add(stockSupplier);
                }
                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(stock);
            }
            catch (Exception)
            {
                //Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the stock.");
            }
        }

        [HttpGet]
        [Route("ReadAllStockAsync")]
        public async Task<IActionResult> ReadAllStockAsync()
        {
            try
            {
                // Fetch all stock using the ICRUDRepository
                var stock = await iCRUDRepository.ReadAllAsync<Stock>();

                // Fetch the associated suppliers using eager loading
                var stockIds = stock.Select(e => e.Stock_ID).ToList();
                var stockSuppliers = await safariSyncDBContext.StockSupplier
                    .Where(es => stockIds.Contains(es.Stock_ID))
                    .Include(es => es.Supplier!)
                    .ThenInclude(est => est.SupplierType)
                    .ToListAsync();

                // Populate the StockSupplier property for each stock item
                foreach (var item in stock)
                {
                    // Filter the stockSuppliers list for the current stock item
                    var suppliersForStock = stockSuppliers
                        .Where(es => es.Stock_ID == item.Stock_ID)
                        .ToList();

                    // Assign the filtered list to the StockSupplier property of the current stock item
                    item.StockSupplier = suppliersForStock;
                }

                // Return the stock data with associated suppliers
                return Ok(stock);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching stock data.");
            }
        }

        [HttpGet]
        [Route("ReadOneStockAsync/{id}")]
        public async Task<IActionResult> ReadOneStockByIdAsync(int id)
        {
            try
            {
                // Fetch the stock by ID using SafariSyncDBContext with eager loading of StockSupplier and Supplier
                var stock = await safariSyncDBContext.Stock
                    .Include(e => e.StockSupplier)
                    .ThenInclude(es => es.Supplier!)
                    .ThenInclude(est => est.SupplierType)
                    .FirstOrDefaultAsync(e => e.Stock_ID == id);

                // If stock with the given ID is not found, return a not found response
                if (stock == null)
                    return NotFound();

                // Return the stock data with associated suppliers
                return Ok(stock);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching stock data.");
            }
        }

        [HttpPut]
        [Route("UpdateStockAsync")]
        public async Task<IActionResult> UpdateStockAsync(StockViewModel stockViewModel)
        {
            try
            {
                // Validate the input stock data if necessary
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Fetch the existing stock by ID using SafariSyncDBContext
                var existingStock = await safariSyncDBContext.Stock
                    .Include(e => e.StockSupplier)
                    .FirstOrDefaultAsync(e => e.Stock_ID == stockViewModel.Stock_ID);

                // If stock with the given ID is not found, return a not found response
                if (existingStock == null)
                {
                    return NotFound();
                }

                // Update the Stock entity from the view model
                existingStock.Stock_Name = stockViewModel.Stock_Name;
                existingStock.Stock_Description = stockViewModel.Stock_Description;
                existingStock.Stock_Quantity_On_Hand = stockViewModel.Stock_Quantity_On_Hand;
                existingStock.Stock_Low_Level_Warning = stockViewModel.Stock_Low_Level_Warning;

                // Remove existing StockSupplier records associated with this stock
                foreach (var existingSupplier in existingStock.StockSupplier.ToList())
                {
                    existingStock.StockSupplier.Remove(existingSupplier);
                }

                // Create new associated StockSupplier records
                foreach (var supplier in stockViewModel.Suppliers)
                {
                    var stockSupplier = new StockSupplier
                    {
                        Stock_ID = existingStock.Stock_ID,
                        Supplier_ID = supplier.Supplier_ID
                    };
                    existingStock.StockSupplier.Add(stockSupplier);
                }

                // Save changes asynchronously in the CRUD repository
                await iCRUDRepository.SaveChangesAsync();

                // Return the successful response
                return Ok(existingStock);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the stock.");
            }
        }

        [HttpDelete]
        [Route("DeleteStock/{id}")]
        public async Task<IActionResult> DeleteStock(int id)
        {
            try
            {
                // Fetch the existing stock by ID using SafariSyncDBContext
                var existingStock = await safariSyncDBContext.Stock.Include(e => e.StockSupplier).FirstOrDefaultAsync(e => e.Stock_ID == id);

                // If stock with the given ID is not found, return a not found response
                if (existingStock == null)
                {
                    return NotFound();
                }

                // Remove the stock from the database using ICRUDRepository
                iCRUDRepository.Delete(existingStock);

                // Remove the associated StockSupplier records from the database using ICRUDRepository
                foreach (var supplier in existingStock.StockSupplier.ToList())
                {
                    iCRUDRepository.Delete(supplier);
                }

                try
                {
                    // Save changes asynchronously in the context
                    await safariSyncDBContext.SaveChangesAsync();

                    // Return the successful response
                    return Ok(existingStock);
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
                        return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the stock.");
                    }
                }
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the stock.");
            }
        }

        [HttpGet]
        [Route("ReadOneStockSupplierAsync/{id}")]
        public async Task<IActionResult> ReadOneStockSupplierByIdAsync(int id)
        {
            try
            {
                // Fetch the stock by ID using SafariSyncDBContext with eager loading of StockSupplier and Supplier
                var stockSupplier = await safariSyncDBContext.StockSupplier
                    .Include(e => e.Supplier!)
                    .ThenInclude(es => es.SupplierType)
                    .FirstOrDefaultAsync(e => e.StockSupplier_ID == id);

                // If stock with the given ID is not found, return a not found response
                if (stockSupplier == null)
                    return NotFound();

                // Return the stock data with associated suppliers
                return Ok(stockSupplier);
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching stock data.");
            }
        }

        [HttpDelete]
        [Route("DeleteStockSupplier/{stockSupplierID}")]
        public async Task<IActionResult> DeleteStockSupplier(int stockSupplierID)
        {
            try
            {
                // Retrieve the existing supplier from the CRUD repository based on the supplierID
                var stockSupplier = await iCRUDRepository.ReadOneAsync<StockSupplier>(stockSupplierID);

                // If the existing supplier is not found, return a NotFound response with an appropriate message
                if (stockSupplier == null)
                    return NotFound("The supplier does not exist");

                // Retrieve the Stock ID of the stock associated with this StockSupplier record
                int stockID = stockSupplier.Stock_ID;

                // Check if this is the last StockSupplier record for the associated Stock ID
                bool isLastSupplierForStock = await IsLastSupplierForStock(stockID, stockSupplierID);

                // If this is the last supplier for the associated stock, return a BadRequest response
                if (isLastSupplierForStock)
                    return BadRequest("The stock must have at least one supplier.");

                // Delete the supplier from the CRUD repository
                iCRUDRepository.Delete(stockSupplier);

                // Save changes asynchronously in the CRUD repository and check if the operation succeeds
                if (await iCRUDRepository.SaveChangesAsync())
                    return Ok(stockSupplier);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }

            // Return a BadRequest response if the request is invalid
            return BadRequest("Your request is invalid.");
        }

        private async Task<bool> IsLastSupplierForStock(int stockID, int stockSupplierID)
        {
            // Retrieve the total number of suppliers associated with the given stockID
            int totalSupplierCount = await safariSyncDBContext.StockSupplier
                .Where(es => es.Stock_ID == stockID)
                .CountAsync();

            // Retrieve the number of suppliers for the stock excluding the selected record
            int supplierCount = await safariSyncDBContext.StockSupplier
                .Where(es => es.Stock_ID == stockID && es.StockSupplier_ID != stockSupplierID)
                .CountAsync();

            // Return true if the supplierCount is equal to the total count minus one, indicating this is the last supplier for the stock
            return totalSupplierCount < 2;
        }
    }
}