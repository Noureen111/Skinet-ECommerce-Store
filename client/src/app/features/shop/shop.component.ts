import { Component, inject } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/Product';
import { ProductItemComponent } from './product-item/product-item.component';
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ProductItemComponent, MatIconModule, MatButtonModule, MatMenuModule, MatSelectModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent {
  products: Product[] = [];
  selectedTypes: string[] = [];
  selectedBrands: string[] = [];

  selectedSort: string = "name";
  sortOptions = [
    {name: "Alphabetical", value: "name"},
    {name: "Low-High", value: "priceAsc"},
    {name: "Hight-Low", value: "priceDesc"}
  ];

  constructor(
    private shopService: ShopService,
    private dialogService: MatDialog
  )
  {}

  ngOnInit() {
    this.shopService.getTypes();
    this.shopService.getBrands();
    this.getProducts();
  }

  getProducts() {
    this.shopService.getProducts(this.selectedTypes, this.selectedBrands, this.selectedSort).subscribe({
      next: response => this.products = response.data,
      error: error => console.log(error)
    });
  }

  onSortChange(event: MatSelectChange) {
    const selectedOption = event.value;
    if(selectedOption) {
      this.selectedSort = selectedOption;
      console.log(selectedOption);
      this.getProducts(); 
    }
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      minWidth: '500px',
      minHeight: '500px',
      data: {
        selectedTypes: this.selectedTypes,
        selectedBrands: this.selectedBrands
      }
    });

    dialogRef.afterClosed().subscribe({
      next: result => {
        if(result) {
          console.log(result);
          this.selectedTypes = result.selectedTypes;
          this.selectedBrands = result.selectedBrands;
          this.getProducts();
        }
      }
    })
  }
}
