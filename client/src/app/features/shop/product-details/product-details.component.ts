import { Component } from '@angular/core';
import { Product } from '../../../shared/models/product';
import { ShopService } from '../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatDivider } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatButtonModule,
    MatIconModule,
    MatFormField,
    MatLabel,
    MatDivider,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {

  product?: Product;
  quantityInCart = 0;
  quantity = 1;  

  constructor(
    private shopService: ShopService,
    private activatedRoute: ActivatedRoute,
    public cartService: CartService
  ) {}

  ngOnInit() {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if(!id) return;

    this.shopService.getProduct(+id).subscribe({
      next: response => {
        this.product = response;
        this.updateQuantityInCart();
      },
      error: error => console.log(error)      
    })
  }

  updateCart() {
    if(!this.product) return;
    if(this.quantity > this.quantityInCart) {
      const itemsToAdd = this.quantity - this.quantityInCart;
      this.quantityInCart += itemsToAdd;
      this.cartService.addItemToCart(this.product, itemsToAdd);
    }
    else {
      const itemsToRemove = this.quantityInCart - this.quantity;
      this.quantityInCart -= itemsToRemove;
      this.cartService.removeItemFromCart(this.product.id, itemsToRemove);
    }
  }

  updateQuantityInCart() {
    this.quantityInCart = this.cartService.cart()?.items.find(x => x.productId === this.product?.id)?.quantity || 0;
    this.quantity = this.quantityInCart || 1;
  }

  getButtonText() {
    return this.quantityInCart > 0 ? "Update Cart" : "Add To Cart";
  }
}
