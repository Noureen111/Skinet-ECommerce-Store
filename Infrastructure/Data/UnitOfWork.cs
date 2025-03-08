using Core.Entities;
using Core.Interfaces;
using System.Collections.Concurrent;

namespace Infrastructure.Data
{
    public class UnitOfWork(StoreContext context) : IUnitOfWork
    {
        private readonly ConcurrentDictionary<string, object> _repositories = new(); 
        public async Task<bool> Complete()
        {
            return await context.SaveChangesAsync() > 0;
        }

        public void Dispose()
        {
            context.Dispose();
        }

        public IGenericRepository<TEnitity> Repository<TEnitity>() where TEnitity : BaseEntity
        {
            var type = typeof(TEnitity).Name;
            return (IGenericRepository<TEnitity>)_repositories.GetOrAdd(type, t =>
            {
                var repositoryType = typeof(GenericRepository<>).MakeGenericType(typeof(TEnitity));
                return Activator.CreateInstance(repositoryType, context) ??
                throw new Exception($"Could not create repository instance for ${type}");
            });
        }
    }
}
