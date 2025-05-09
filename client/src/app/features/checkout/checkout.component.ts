import { ChangeDetectorRef, Component, signal, ViewChild } from '@angular/core';
import { OrderSummaryComponent } from "../../shared/components/order-summary/order-summary.component";
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { StripeService } from '../../core/services/stripe.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { ConfirmationToken, StripeAddressElement, StripeAddressElementChangeEvent, StripeCardElement, StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Address } from '../../shared/models/User';
import { AccountService } from '../../core/services/account.service';
import { firstValueFrom } from 'rxjs';
import { CheckoutDeliveryComponent } from "./checkout-delivery/checkout-delivery.component";
import { CheckoutReviewComponent } from "./checkout-review/checkout-review.component";
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderToCreate, ShippingAddress } from '../../shared/models/order';
import { OrderService } from '../../core/services/order.service';


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
    CurrencyPipe,
    MatProgressSpinnerModule
],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  @ViewChild('stepper') stepper!: MatStepper;

  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;
  cardElement?: StripeCardElement;
  confirmationToken?: ConfirmationToken;
  saveAddress: boolean = false;
  loading: boolean = false;
  completionStatus = signal<{address: boolean, card: boolean, delivery: boolean}>({address: false, card: false, delivery: false});

  addressElementMounted = false;
  paymentElementMounted = false;


  constructor(
    private stripeService: StripeService,
    private snackbarService: SnackbarService,
    private accountService: AccountService,
    public cartService: CartService,
    private router: Router,
    private orderService: OrderService,
    private cdRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    try {
      this.addressElement = await this.stripeService.createAddressElement();
      this.addressElement.mount("#address-element");
      this.addressElement.on("change", this.handleAddressChange);
  
      // Wait for Angular to finish detecting changes
      this.cdRef.detectChanges();
    } catch (error: any) {
      this.snackbarService.error(error.message);
    }
  }

  //in case didn't mounted, as mat elements take time in rendering and that's why address element was not being appeared.
  async ngAfterViewInit() {
    try {
      this.addressElement = await this.stripeService.createAddressElement();
      this.addressElement.mount("#address-element");
      this.addressElement.on("change", this.handleAddressChange);
    } catch (error: any) {
      this.snackbarService.error(error.message);
    }
  }
  

  handleAddressChange = (event: StripeAddressElementChangeEvent) => {
    this.completionStatus.update(state => {
      state.address = event.complete;
      return state;
    })
  }

  handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    this.completionStatus.update(state => {
      state.card = event.complete;
      return state;
    })
  }

  handleDeliveryChange(event: boolean) {
    this.completionStatus.update(state => {
      state.delivery = event;
      return state;
    })
  }

  async getConfirmationToken() {
    try {
      if(Object.values(this.completionStatus()).every(status => status === true)) {
        const result = await this.stripeService.createConfirmationToken();
        if(result.error) throw new Error(result.error.message);
        this.confirmationToken = result.confirmationToken;
        console.log(this.confirmationToken);
      }
    } 
    catch (error: any) {
      this.snackbarService.error(error.message);
    }
  }

  onSaveAddressCheckboxChange(event: MatCheckboxChange) {
    this.saveAddress = event.checked;
  }

  // async onSelectionChange(event: StepperSelectionEvent) {
  //   if(event.selectedIndex === 1) {
  //     if(this.saveAddress) {
  //       const address = await this.getAddressFromStripeAddress() as Address;
  //       address && firstValueFrom(this.accountService.updateAddress(address));
  //     }
  //   }
  //   if(event.selectedIndex === 3) {
  //     await this.getConfirmationToken();
  //   }
  // }

  async onSelectionChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 0 && !this.addressElementMounted) {
      this.addressElement = await this.stripeService.createAddressElement();
      this.addressElement.mount("#address-element");
      this.addressElement.on("change", this.handleAddressChange);
      this.addressElementMounted = true;
    }
  
    if (event.selectedIndex === 2 && !this.paymentElementMounted) {
      this.paymentElement = await this.stripeService.createPaymentElement();
      this.paymentElement.mount("#payment-element");
      this.paymentElement.on("change", this.handlePaymentChange);
      this.paymentElementMounted = true;
    }
  
    if (event.selectedIndex === 1 && this.saveAddress) {
      const address = await this.getAddressFromStripeAddress() as Address;
      address && firstValueFrom(this.accountService.updateAddress(address));
    }
  
    if (event.selectedIndex === 3) {
      await this.getConfirmationToken();
    }
  }
  

  async confirmPayment(stepper: MatStepper) {
    this.loading = true;
    try {
      if(this.confirmationToken) {
        //Make payment
        const result = await this.stripeService.confirmPayment(this.confirmationToken);

        //If spayment succeeded create order
        if(result.paymentIntent?.status === 'succeeded') {
          const order = await this.createOrderModel();
          const orderResult = await firstValueFrom(this.orderService.createOrder(order));

          //If order created delete cart and navigate
          if(orderResult) {
            this.orderService.orderComplete = true;
            this.cartService.deleteCart();
            this.cartService.selectedDelivery.set(null);
            this.router.navigateByUrl("/checkout/success");
          }
          else {
            throw new Error("Order creation failed");
          }
        }
        else if(result.error) throw new Error(result.error.message);
        else throw new Error("Something went wrong");
      }
    } catch (error: any) {
      this.snackbarService.error(error.message || "Something went wrong");
      stepper.previous();
    }
    finally {
      this.loading = false;
    }
  }

  private async createOrderModel(): Promise<OrderToCreate> {
    const cart = this.cartService.cart();
    const shippingAddress = await this.getAddressFromStripeAddress() as ShippingAddress;
    const card = this.confirmationToken?.payment_method_preview.card;

    if(!cart?.id || !cart.deliveryMethodId || !card || !shippingAddress) {
      throw new Error("Problem creating order");
    }

    return {
      cartId: cart.id,
      paymentSummary: {
        last4: +card.last4,
        brand: card.brand,
        expMonth: card.exp_month,
        expYear: card.exp_year
      },
      deliveryMethodId: cart.deliveryMethodId,
      shippingAddress
    }
  }

  async getAddressFromStripeAddress(): Promise<Address | ShippingAddress | null> {
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;

    if(address) {
      return {
        name: result.value.name,
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
