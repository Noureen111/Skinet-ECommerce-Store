import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../../shared/models/cart';
import { Product } from '../../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  baseUrl = environment;
  cart = signal<Cart | null>(null);

  constructor(
    private httpClient: HttpClient 
  ) { }

  getCart(id: string) {
    return this.httpClient.get<Cart>(this.baseUrl + "cart?id=" + id).subscribe({
      next: cart => this.cart.set(cart)
    });
  }

  setCart(cart: Cart) {
    return this.httpClient.post<Cart>(this.baseUrl + "cart", cart).subscribe({
      next: cart => this.cart.set(cart)
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

