import { Component } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../shared/models/order';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {

  orders: Order[] = [];

  constructor(
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.orderService.getOrdersForUser().subscribe({
      next: orders => this.orders = orders
    })
  }
}
