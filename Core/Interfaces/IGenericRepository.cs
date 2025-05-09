﻿
using Core.Entities;

namespace Core.Interfaces
{
    public interface IGenericRepository<T> where T: BaseEntity
    {
        Task<T?> GetById(int id);
        Task<IReadOnlyList<T>> ListAllAsync();
        Task<T?> GetEntityWithSpec(ISpecification<T> spec);
        Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec);
        Task<TResult?> GetEntityWithSpec<TResult>(ISpecification<T, TResult> spec);
        Task<IReadOnlyList<TResult>> ListAsync<TResult>(ISpecification<T, TResult> spec);
        void Add(T entity);
        void Update(T entity);
        void Detele(T entity);
        //Task<bool> SaveAllAsync(); // Removing it because now will use Unit of work that contains Complete() method.
        bool Exists(int id);
        Task<int> CountAsync(ISpecification<T> spec);
    }
}
