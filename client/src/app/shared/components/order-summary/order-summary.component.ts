import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [
    RouterLink,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton
  ],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent {

}
