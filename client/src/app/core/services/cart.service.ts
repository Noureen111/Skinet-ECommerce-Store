import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../../shared/models/cart';
import { Product } from '../../shared/models/product';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  baseUrl = environment.apiUrl;
  cart = signal<Cart | null>(null);
  itemCount = computed(() => {
    return this.cart()?.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  })

  totals = computed(() => {
    const cart = this.cart();
    if(!cart) return null;
    const subtotal = cart.items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
    const shipping = 0;
    const discount = 0;
    return {
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount
    };
  })

  constructor(
    private httpClient: HttpClient 
  ) { }

  getCart(id: string) {
    return this.httpClient.get<Cart>(this.baseUrl + "cart?id=" + id).pipe(
      map(cart => {
        this.cart.set(cart);
        return cart;
      })
    )
  }

  setCart(cart: Cart) {
    return this.httpClient.post<Cart>(this.baseUrl + "cart", cart).subscribe({
      next: cart => this.cart.set(cart),
      error: err => console.log(err)
    })
  }

  addItemToCart(item: CartItem | Product, quantity = 1) {
    const cart = this.cart() ?? this.createCart();
    if(this.isProduct(item)) {
      item = this.mapProductToCartItem(item);
    }

    cart.items = this.addOrUpdateCart(cart.items, item, quantity);
    this.setCart(cart);
  }

  removeItemFromCart(productId: number, quantity: number = 1) {
    const cart = this.cart();
    if(!cart) return;

    const index = cart.items.findIndex(x => x.productId === productId);
    if(index !== -1) {
      if(cart.items[index].quantity > quantity) {
        cart.items[index].quantity -= quantity;
      }
      else {
        cart.items.splice(index, 1);
      }

      if(cart.items.length === 0) {
        this.deleteCart();
      }
      else {
        this.setCart(cart);
      }
    }
  }

  deleteCart() {
    this.httpClient.delete(this.baseUrl + "cart?id=" + this.cart()?.id).subscribe({
      next: () => {
        localStorage.removeItem("Cart_id");
        this.cart.set(null);
      }
    })
  }

  private addOrUpdateCart(items: CartItem[], item: CartItem, quantity: number): CartItem[] {
    const index = items.findIndex(x => x.productId === item.productId);
    if(index === -1) {
      item.quantity = quantity;
      items.push(item);
    } 
    else {
      items[index].quantity += quantity;
    }
    return items; 
  }

  private mapProductToCartItem(item: Product): CartItem {
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.brand,
      type: item.type
    };
  }

  private isProduct(item: CartItem | Product): item is Product {
    return (item as Product).id !== undefined;
  } 

  createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem("cart_id", cart.id);
    return cart;
  }
}

