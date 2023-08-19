namespace SafariSync_API.Repositories.CRUD
{
    public interface ICRUDRepository
    {
        void Add<T>(T entity) where T : class;

        Task<T[]> ReadAllAsync<T>() where T : class;

        Task<T?> ReadOneAsync<T>(int id) where T : class;

        void Update<T>(T entity) where T : class;

        void Delete<T>(T entity) where T : class;

        Task<bool> SaveChangesAsync();
    }
}