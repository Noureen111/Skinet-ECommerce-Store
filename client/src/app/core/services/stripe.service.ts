import { Injectable } from '@angular/core';
import { ConfirmationToken, loadStripe, Stripe, StripeAddressElement, StripeAddressElementOptions, StripeCardElement, StripeCardElementOptions, StripeElements, StripePaymentElement } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart.service';
import { Cart } from '../../shared/models/cart';
import { firstValueFrom, map } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  private stripePromise: Promise<Stripe | null>;
  private elements?: StripeElements;
  private addressElement?: StripeAddressElement;
  private paymentElement?: StripePaymentElement;
  // private cardElement?: StripeCardElement;
  baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private accountService: AccountService
  ) { 
    this.stripePromise = loadStripe(environment.StripePublicKey);
  }

  getStripeInstance() {
    return this.stripePromise;
  }

  async initializeElements() {
    
    if(!this.elements) {
      const stripe = await this.getStripeInstance();

      if(stripe) {
        const cart = await firstValueFrom(this.createOrUpdatePaymentIntent());
        this.elements = stripe.elements({clientSecret: cart.clientSecret, appearance: {labels: "floating"}});
      }
      else {
        throw new Error("stripe has not been loaded");
      }
    }

    return this.elements;
  }

  async createAddressElement() {
    if(!this.addressElement) {
      const elements = await this.initializeElements();
      if(elements) {

        const user = this.accountService.currentUser();
        let defaultValues: StripeAddressElementOptions['defaultValues'] = {};
        if(user) {
          defaultValues.name = user.firstName + " " + user.lastName;
        }

        if(user?.address) {
          defaultValues.address = {
            line1: user.address.line1,
            line2: user.address.line2,
            city: user.address.city,
            state: user.address.state,
            country: user.address.country,
            postal_code: user.address.postalCode
          };
        }

        const options: StripeAddressElementOptions = {
          mode: "shipping",
          defaultValues
        };

        this.addressElement = elements.create("address", options);
      }
      else {
        throw new Error("Elements instance has not been loaded");
      }
    }

    return this.addressElement;
  }

  async createPaymentElement() {
    if(!this.paymentElement) {
      const elements = await this.initializeElements();

      if(elements) {
        this.paymentElement = elements.create("payment");
      }
      else {
        throw new Error("Elements instance has not been loaded");
      }
    }
    return this.paymentElement;
  }

  // async createCardElement() {
  //   if(!this.cardElement) {
  //     const elements = await this.initializeElements();
  //     if(elements) {
  //       const options: StripeCardElementOptions = {}

  //       this.cardElement = elements.create("card", options)
  //     }
  //     else {
  //       throw new Error("Elements instance has not been loaded");
  //     }
  //   } 

  //   return this.cardElement;
  // }

  createOrUpdatePaymentIntent() {
    const cart = this.cartService.cart();
    const hasClientSecret = !!cart?.clientSecret;
    if(!cart) throw Error("Problem with cart");
    
    return this.http.post<Cart>(this.baseUrl + "payments/" + cart.id, {}).pipe(
      map(async cart => {
         if (!hasClientSecret) {
          await firstValueFrom(this.cartService.setCart(cart));
          return cart;
         }
        return cart;
      })
    )
  }

  async createConfirmationToken() {
    const stripe = await this.getStripeInstance();
    const elements = await this.initializeElements();
    const result = elements.submit();
    if((await result).error) throw new Error((await result).error?.message);
    
    if(stripe) {
      return await stripe.createConfirmationToken({elements});
    } else {
      throw new Error("Stripe not available");
    }
  }

  async confirmPayment(confirmationToken: ConfirmationToken) {
    const stripe = await this.getStripeInstance();
    const elements = await this.initializeElements();

    // Ensure latest payment intent and clientSecret before confirming payment
    const cart = await firstValueFrom(this.createOrUpdatePaymentIntent()); 
    // const clientSecret = cart.clientSecret; 
    
    const result = elements.submit();
    await this.createOrUpdatePaymentIntent();
    if((await result).error) throw new Error((await result).error?.message);

    const clientSecret = this.cartService.cart()?.clientSecret;
    if(stripe && clientSecret) {
      return await stripe.confirmPayment({
        clientSecret: clientSecret,
        confirmParams: {
          confirmation_token: confirmationToken.id
        },
        redirect: 'if_required'
      });
    }
    else {
      throw new Error("Stripe not available");
    }
  }

  disposeElements() {
    this.elements = undefined;
    this.addressElement = undefined;
    this.paymentElement = undefined;
  }
}
