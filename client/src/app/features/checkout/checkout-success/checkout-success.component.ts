import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { AddressPipe } from '../../../shared/pipes/address.pipe';
import { PaymentCardPipe } from '../../../shared/pipes/payment-card.pipe';
import { SignalrService } from '../../../core/seevices/signalr.service';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [
    MatButton,
    RouterLink,
    MatProgressSpinnerModule,
    DatePipe,
    AddressPipe,
    PaymentCardPipe,
    CurrencyPipe,
    NgIf
  ],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccessComponent implements OnDestroy {
  constructor(
    public signalrService: SignalrService,
    private orderService: OrderService
  ) {}

  ngOnDestroy() {
    this.orderService.orderComplete = false;
    this.signalrService.orderSignal.set(null);
  }
}
