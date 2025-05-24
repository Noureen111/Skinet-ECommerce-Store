import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyPipe, Location, NgIf } from '@angular/common';
import { StripeService } from '../../../core/services/stripe.service';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [
    RouterLink,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    CurrencyPipe,
    FormsModule,
    NgIf,
    MatIcon
  ],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent {

  code?: string;
  

  constructor(
    public cartService: CartService,
    private stripeService: StripeService,
    public location: Location
  ) {}

   applyCouponCode() {
    if (!this.code) return;
    this.cartService.applyDiscount(this.code).subscribe({
      next: async coupon => {
        const cart = this.cartService.cart();
        debugger
        if (cart) {
          cart.coupon = coupon;
          this.cartService.setCart(cart);
          this.code = undefined;
          this.cartService.isCouponApplied = true;
          this.cartService.couponName = coupon.name;
          this.cartService.coupon.set(cart.coupon);
        }
        if (this.location.path() === '/checkout') {
          await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
        }
      }
    });
  }

  async removeCouponCode() {
    const cart = this.cartService.cart();
    if (!cart) return;
    if (cart.coupon) this.cartService.resetCoupon();
    this.cartService.isCouponApplied = false;
    this.cartService.couponName = ''; 
    cart.coupon = undefined;
    this.cartService.setCart(cart);
    this.cartService.coupon.set(null);
    this.cartService.resetCoupon();
    if (this.location.path() === '/checkout') {
      await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
    }
  }
}
