import { Component, Input } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { ConfirmationToken } from '@stripe/stripe-js';
import { PaymentCardPipe } from '../../../shared/pipes/payment-card.pipe';
import { AddressPipe } from '../../../shared/pipes/address.pipe';

@Component({
  selector: 'app-checkout-review',
  standalone: true,
  imports: [
    CurrencyPipe,
    AddressPipe,
    PaymentCardPipe
  ],
  templateUrl: './checkout-review.component.html',
  styleUrl: './checkout-review.component.scss'
})
export class CheckoutReviewComponent {

  @Input() confirmationToken?: ConfirmationToken;

  constructor(
    public cartService: CartService
  ) {}
}
