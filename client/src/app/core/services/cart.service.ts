import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../../shared/models/cart';

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
}
