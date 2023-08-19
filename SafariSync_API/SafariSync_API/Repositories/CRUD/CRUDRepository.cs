using Microsoft.EntityFrameworkCore;
using SafariSync_API.Data;
using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using System.Reflection;

namespace SafariSync_API.Repositories.CRUD
{
    public class CRUDRepository : ICRUDRepository
    {
        private readonly SafariSyncDBContext safariSyncDBContext;

        // Constructor for the CRUDRepository class
        public CRUDRepository(SafariSyncDBContext safariSyncDBContext)
        {
            // Assigning the passed-in SafariSyncDBContext instance to the private readonly field
            this.safariSyncDBContext = safariSyncDBContext;
        }

        public void Add<T>(T? entity) where T : class
        {
            // Add the specified entity to the database context
            safariSyncDBContext.Add(entity!);
        }

        public async Task<T[]> ReadAllAsync<T>() where T : class
        {
            // Get an IQueryable representation of the specified entity type within the database context
            IQueryable<T> query = safariSyncDBContext.Set<T>();

            // Execute the query asynchronously and return the result as an array
            return await query.ToArrayAsync();
        }

        public async Task<T?> ReadOneAsync<T>(int id) where T : class
        {
            // Get the type of the entity
            Type entityType = typeof(T);

            // Get the primary key property of the entity
            PropertyInfo? primaryKeyProperty = entityType.GetProperties().FirstOrDefault(property => Attribute.IsDefined(property, typeof(KeyAttribute)));

            if (primaryKeyProperty == null)
            {
                throw new InvalidOperationException("The entity type does not have a primary key defined.");
            }

            // Get the name of the primary key property
            string idName = primaryKeyProperty.Name;

            // Create a parameter expression for the entity type
            var entityParameter = Expression.Parameter(entityType, "entity");

            // Create the ID condition expression
            var idCondition = Expression.Equal(
                Expression.Property(entityParameter, primaryKeyProperty),
                Expression.Constant(id));

            // Create a lambda expression for the where clause with the ID condition
            var whereLambda = Expression.Lambda<Func<T, bool>>(idCondition, entityParameter);

            // Create an IQueryable<T> by applying the where clause to the entity set
            IQueryable<T> query = safariSyncDBContext.Set<T>().Where(whereLambda);

            // Execute the query asynchronously and return the first matching entity, or null if none found
            return await query.FirstOrDefaultAsync();
        }

        public void Update<T>(T entity) where T : class
        {
            // Update the specified entity in the database context
            safariSyncDBContext.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            // Remove the specified entity from the database context
            safariSyncDBContext.Remove(entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            // Save changes asynchronously and return a boolean indicating if any changes were saved
            return await safariSyncDBContext.SaveChangesAsync() > 0;
        }
    }
}