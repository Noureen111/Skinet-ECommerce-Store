using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController(IGenericRepository<Product> genericRepository) : ControllerBase
    {
        [HttpGet("")]
        public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts(string? brand, string? type, string? sort)
        {
            var spec = new ProductSpecification(brand, type, sort);
            var products = await genericRepository.ListAsync(spec);

            return Ok(products);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            Product? product = await genericRepository.GetById(id);
            if (product == null) return NotFound();

            return product;
        }

        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            genericRepository.Add(product);
            if(await genericRepository.SaveAllAsync())
            {
                return CreatedAtAction("GetProduct", new { id = product.Id }, product);
            }
            return BadRequest("poble creating product!");
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> UpdateProduct(int id, Product product)
        {
            if (product.Id != id || !ProductExists(id))
                return BadRequest("Cannot update product!");

            genericRepository.Update(product);
            if(await genericRepository.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Problem updaing product!");
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            Product? product = await genericRepository.GetById(id);
            if (product == null) return NotFound();

            genericRepository.Detele(product);
            if (await genericRepository.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Problem deleting product!");
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<string>>> GetBrands()
        {
            //ToString Implemenet method
            return Ok();
        }

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
        {
            //ToString Implemenet method
            return Ok();
        }

        private bool ProductExists(int id)
        {
            return genericRepository.Exists(id);
        }
    }
}
