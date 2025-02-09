import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { SnackbarService } from '../services/snackbar.service';
import { map, of } from 'rxjs';
import { Cart } from '../../shared/models/cart';

export const emptyCartGuard: CanActivateFn = (route, state) => {

  const cartService = inject(CartService);
  const router = inject(Router);
  const snackbarService = inject(SnackbarService);
  
  if(cartService.cart() && cartService.cart()?.items.length)
    return of(true);
  else {
    const cartId = localStorage.getItem('cart_id');
    if(cartId) {
      return cartService.getCart(cartId).pipe(
        map((cart: Cart) => {
          if(cart.items?.length > 0) return true
          else {
            snackbarService.error("Your cart is empty");
            router.navigate(["/cart"]);
            return false;
          }
        })
      ) 
    }
    else {
      return of(false)
    }
  }
};
