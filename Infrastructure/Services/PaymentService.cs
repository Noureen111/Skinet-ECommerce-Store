﻿
using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;
using Product = Core.Entities.Product;

namespace Infrastructure.Services
{
    public class PaymentService(IConfiguration config, ICartService cartService, IUnitOfWork unit) : IPaymentService
    {
        public async Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cartId)
        {
            StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

            var cart = await cartService.GetCartAsync(cartId);

            if (cart == null) return null;

            var shippingPrice = 0m;
            
            if(cart.DeliveryMethodId.HasValue)
            {
                var deliveryMethod = await unit.Repository<DeliveryMethod>().GetById((int)cart.DeliveryMethodId);
                if (deliveryMethod == null) return null;

                shippingPrice = deliveryMethod.Price;
            }

            foreach(var item in cart.Items)
            {
                var productItem = await unit.Repository<Product>().GetById(item.ProductId);

                if (productItem == null) return null;

                if (item.Price != productItem.Price)
                    item.Price = productItem.Price;
            }

            var service = new PaymentIntentService();
            PaymentIntent? intent = null;

            if (string.IsNullOrEmpty(cart.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions()
                {
                    Amount = (long)cart.Items.Sum(x => (x.Price * 100) * x.Quantity) + (long)shippingPrice * 100,
                    Currency = "USD",
                    PaymentMethodTypes = ["card"]
                };

                intent = await service.CreateAsync(options);
                cart.PaymentIntentId = intent.Id;
                cart.ClientSecret = intent.ClientSecret;
            } 
            else
            {
                var options = new PaymentIntentUpdateOptions()
                {
                    Amount = (long)cart.Items.Sum(x => (x.Price * 100) * x.Quantity) + (long)shippingPrice * 100
                };

                intent = await service.UpdateAsync(cart.PaymentIntentId, options);
                cart.ClientSecret = intent.ClientSecret;
            }

            await cartService.SetCartAsync(cart);

            return cart;
        }
    }
}
