
using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services
{
    public class PaymentService(IConfiguration config, ICartService cartService, 
        IGenericRepository<Product> productRepo, IGenericRepository<DeliveryMethod> dmRepo) : IPaymentService
    {
        public Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cartId)
        {
            throw new NotImplementedException();
        }
    }
}
