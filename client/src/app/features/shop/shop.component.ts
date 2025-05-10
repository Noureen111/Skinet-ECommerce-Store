import { Component, inject } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/product';
import { ProductItemComponent } from './product-item/product-item.component';
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ShopParams } from '../../shared/models/shopParams';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/models/pagination';
import { FormsModule } from '@angular/forms';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';


@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    ProductItemComponent, 
    MatIconModule, 
    MatButtonModule, 
    MatMenuModule, 
    MatSelectModule, 
    MatPaginatorModule,
    FormsModule,
    EmptyStateComponent
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent {
  products?: Pagination<Product>;
  sortOptions = [
    {name: "Alphabetical", value: "name"},
    {name: "Low-High", value: "priceAsc"},
    {name: "Hight-Low", value: "priceDesc"}
  ];
  pageSizeOptions = [5, 10, 15, 20];
  shopParams: ShopParams = new ShopParams();

  constructor(
    private shopService: ShopService,
    private dialogService: MatDialog
  )
  {}

  ngOnInit() {
    this.initializeShop();
  }

  initializeShop() {
    this.shopService.getTypes();
    this.shopService.getBrands();
    this.getProducts();
  }

  resetFilters() {
    this.shopParams = new ShopParams();
    this.getProducts();
  }

  getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => this.products = response,
      error: error => console.log(error)
    });
  }

  onSearchChange() {
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  handlePageEvent(event: PageEvent) {
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;

    this.getProducts();
  }

  onSortChange(event: MatSelectChange) {
    const selectedOption = event.value;
    if(selectedOption) {
      this.shopParams.sort = selectedOption;
      this.shopParams.pageNumber = 1;
      console.log(selectedOption);
      this.getProducts(); 
    }
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      minWidth: '500px',
      minHeight: '500px',
      data: {
        selectedTypes: this.shopParams.types,
        selectedBrands: this.shopParams.brands
      }
    });

    dialogRef.afterClosed().subscribe({
      next: result => {
        if(result) {
          console.log(result);
          this.shopParams.brands = result.selectedTypes;
          this.shopParams.types = result.selectedBrands;
          this.shopParams.pageNumber = 1;
          this.getProducts();
        }
      }
    })
  }
}
