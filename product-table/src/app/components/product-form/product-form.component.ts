import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';

import {Modal, Product} from '../../models';
import {MatSelectModule} from '@angular/material/select';
import {Status} from "../../models/product";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatGridListModule,
    MatSelectModule

  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements  OnInit{

  columnNumber = 2;
  form = new FormGroup({
    status:  new FormControl<Status | undefined>(undefined,  ),
    orderNumber:  new FormControl<number>(0),
    productLine:  new FormControl<string>('' ),
    quantity: new FormControl<string>('' ),
    product: new FormControl<string>(''),
    dateRequested: new FormControl<Date>(new Date()),
  });

  constructor(
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Modal,
  ) {

  }

  ngOnInit(): void {
    const  newProduct = {...this.data.product} as Product;
    if(this.data.product) {
      this.form.setValue(newProduct);
    }
    this.columnNumber  = (window.innerWidth <= 700) ? 1 : 2;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onResize(event: any) {
    this.columnNumber =  (event.target.innerWidth <= 700) ? 1 : 2;
  }
}
