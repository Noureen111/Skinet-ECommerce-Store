import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { OrderToCreate } from '../../shared/models/order';
import { Order } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createOrder(orderToCreate: OrderToCreate) {
    return this.http.post<Order>(this.baseUrl + "orders", orderToCreate);
  }

  getOrdersForUser() {
    return this.http.get<Order[]>(this.baseUrl + "orders");
  }

  getOrderDetailed(id: number) {
    return this.http.get<Order>(this.baseUrl + "orders/" + id);
  }
}
