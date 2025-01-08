import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Product } from '../../../shared/models/product';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [
    MatCardModule, 
    CurrencyPipe, 
    MatIconModule, 
    MatButtonModule, 
    RouterLink
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {

  @Input() product?: Product;

  constructor(
    public cartService: CartService
  ) {}

  addItemToCart(product: Product) {
    this.cartService.addItemToCart(product);
  }
}
