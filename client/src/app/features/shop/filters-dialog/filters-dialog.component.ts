import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { ShopService } from '../../../core/services/shop.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-filters-dialog',
  standalone: true,
  imports: [MatDividerModule, MatSelectModule, FormsModule, MatButtonModule],
  templateUrl: './filters-dialog.component.html',
  styleUrl: './filters-dialog.component.scss'
})
export class FiltersDialogComponent {

  //Dependancy Injections
  public shopService = inject(ShopService);
  private dialogRef = inject(MatDialogRef<FiltersDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);

  //Variables
  selectedTypes: string[] = this.data.selectedTypes;
  selectedBrands: string[] = this.data.selectedBrands;

  applyFilters() {
    this.dialogRef.close({
      selectedTypes: this.selectedTypes,
      selectedBrands: this.selectedBrands
    })
  }
}
