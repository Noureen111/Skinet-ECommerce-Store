import { Component } from '@angular/core';
import { OrderSummaryComponent } from "../../shared/components/order-summary/order-summary.component";
import {MatStepperModule} from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { StripeService } from '../../core/services/stripe.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { StripeAddressElement, StripeCardElement, StripePaymentElement } from '@stripe/stripe-js';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Address } from '../../shared/models/User';
import { AccountService } from '../../core/services/account.service';
import { firstValueFrom } from 'rxjs';
import { CheckoutDeliveryComponent } from "./checkout-delivery/checkout-delivery.component";
import { CheckoutReviewComponent } from "./checkout-review/checkout-review.component";
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    OrderSummaryComponent,
    MatStepperModule,
    MatButton,
    RouterLink,
    MatCheckboxModule,
    CheckoutDeliveryComponent,
    CheckoutReviewComponent,
    CurrencyPipe
],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;
  cardElement?: StripeCardElement;
  saveAddress: boolean = false;

  constructor(
    private stripeService: StripeService,
    private snackbarService: SnackbarService,
    private accountService: AccountService,
    public cartService: CartService
  ) {}

  async ngOnInit() {
    try {
      this.addressElement = await this.stripeService.createAddressElement();
      this.addressElement.mount("#address-element");

      this.paymentElement = await this.stripeService.createPaymentElement();
      this.paymentElement.mount("#payment-element");
    } catch (error: any) {
      this.snackbarService.error(error.message);
    }
  }

  onSaveAddressCheckboxChange(event: MatCheckboxChange) {
    this.saveAddress = event.checked;
  }

  async onSelectionChange(event: StepperSelectionEvent) {
    if(event.selectedIndex === 1) {
      if(this.saveAddress) {
        const address = await this.getAddressFromStripeAddress();
        address && firstValueFrom(this.accountService.updateAddress(address));
      }
    }
  }

  async getAddressFromStripeAddress(): Promise<Address | null> {
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;

    if(address) {
      return {
        line1: address?.line1,
        line2: address?.line2 || undefined,
        city: address?.city,
        state: address?.state,
        country: address?.country,
        postalCode: address?.postal_code
      };
    }
    else return null;
  }

  ngOnDestroy() {
    this.stripeService.disposeElements();
  }
}
