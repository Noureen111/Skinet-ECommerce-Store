
using Core.Entities;

namespace Core.Interfaces
{
    public interface IGenericRepository<T> where T: BaseEntity
    {
        Task<T?> GetById(int id);
        Task<IReadOnlyList<T>> ListAllAsync();
        Task<T?> GetEntityWithSpec(ISpecification<T> spec);
        Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec);
        void Add(T entity);
        void Update(T entity);
        void Detele(T entity);
        Task<bool> SaveAllAsync();
        bool Exists(int id);
    }
}
