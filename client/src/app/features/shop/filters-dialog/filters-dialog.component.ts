import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { ShopService } from '../../../core/services/shop.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-filters-dialog',
  standalone: true,
  imports: [MatDividerModule, MatSelectModule, FormsModule, MatButtonModule, MatCheckboxModule],
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

  toggleSelection(array: string[], value: string, checked: boolean): void {
    if (checked && !array.includes(value)) {
      array.push(value);
    } else if (!checked) {
      const index = array.indexOf(value);
      if (index !== -1) {
        array.splice(index, 1);
      }
    }
  }
 
}
