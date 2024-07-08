import {Component, computed, effect, ViewChild,} from '@angular/core';
import {Store} from '@ngrx/store';
import {getProducts} from '../../store/selectors/heros.selector';
import {NgFor, NgIf} from '@angular/common';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {provideNativeDateAdapter} from '@angular/material/core';
import {CreateProduct, UpdateProduct} from '../../store/actions/product.actions';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatChipsModule} from '@angular/material/chips';
import {ProductFormComponent} from '../product-form/product-form.component';
import {Product} from '../../models';
import {MatDialog} from '@angular/material/dialog';
import {FilterObject, Status} from "../../models/product";
import {CamelCaseToCapitalizedPipe} from "../../utils/camel-case-to-capitalized.pipe";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";

@Component({
    selector: 'app-products-table',
    standalone: true,
    templateUrl: './product-table.component.html',
    styleUrl: './product-table.component.scss',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    NgIf,
    NgFor,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSortModule,
    MatFormFieldModule,
    MatChipsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule,
    CamelCaseToCapitalizedPipe,
    ReactiveFormsModule,
    MatInput
  ],
  providers: [provideNativeDateAdapter()],
})
export class ProductTableComponent {
  readonly productsList = this.store.selectSignal(getProducts);
  readonly totalCount = computed(() => this.productsList().length + 1);

  readonly displayedColumns: string[] = [
    'status',
    'orderNumber',
    'productLine',
    'product',
    'quantity',
    'dateRequested',
  ];
  readonly pageSize = [5, 10, 20];
  readonly chartPlaceHolder = -1;
  protected readonly Status = Status;
  protected readonly Object = Object;
  dataSource!: MatTableDataSource<Product>;
  filter: string[] = [];
  productLines: string[] = [];
  dataSouceCount = 0;

  filterForm = new FormGroup({
    [Status.pending]:  new FormControl<boolean | null>( null),
    [Status.completed]:  new FormControl<boolean| null>( null),
    [Status.inProgress]:  new FormControl<boolean| null>( null),
    orderNumber:  new FormControl<string| null>(null),
    productLine:  new FormControl<string | null>(null),
    dateFrom: new FormControl<Date | undefined>(undefined),
    dateTo: new FormControl<Date |undefined>(undefined),
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sortList!: MatSort;


  constructor(private readonly store: Store,
    private readonly dialog: MatDialog) {
    effect(() => {
      this.dataSource = new MatTableDataSource<Product>([...this.productsList()]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sortList;
      this.dataSource.filterPredicate = function (data: Product, filter: string) {
        const filtersToApply = JSON.parse(filter) as FilterObject;
        if(Object.values(filtersToApply).every(a => a === null)) {
          return true;
        };
        const statusMatch = Object.values(Status).some(status => {
          return filtersToApply[status] && status === Status[data.status];
        });
        const productLineMatch =  filtersToApply.productLine && filtersToApply.productLine === 'All products'  ? true :  filtersToApply.productLine === data.productLine;
        const orderNumberLineMatch = !!filtersToApply.orderNumber && parseInt(String(filtersToApply.orderNumber)) === data.orderNumber;
       const splitedDate = (data?.dateRequested as unknown as string).split('/');
        const dateFromMatch =   filtersToApply.dateFrom && data?.dateRequested
          && new Date(parseInt(splitedDate[2]),parseInt(splitedDate[1]),parseInt(splitedDate[0])).getTime() >= new Date(filtersToApply.dateFrom).getTime()
        const dateToMatch = filtersToApply.dateTo && data?.dateRequested &&
          new Date(parseInt(splitedDate[2]),parseInt(splitedDate[1]), parseInt(splitedDate[0])).getTime() <= new Date(filtersToApply.dateTo).getTime();
        return  !!(statusMatch || productLineMatch || orderNumberLineMatch ||
          (dateFromMatch && !filtersToApply.dateTo) || (dateToMatch && !filtersToApply.dateFrom) || (dateFromMatch && dateToMatch));
      }
      this.applyFilter(this.filter.concat().toString());
      this.productLines = ['All products', ...new Set(this.productsList().map(item => item['productLine']))];
      this.dataSouceCount = this.dataSource.filteredData.length;
    });

    this.filterForm.valueChanges.subscribe((change ) => {
      this.applyFilter(JSON.stringify(change));
    })
  }

  openDialog(originalProduct: Product | undefined, editMode: boolean) {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      data: {title: 'View product', product: originalProduct, editMode},
    });

    dialogRef.afterClosed().subscribe((product: Product) => {
      if(product?.orderNumber) {
        if(originalProduct){
          this.store.dispatch(UpdateProduct({product}));
        } else {
          this.store.dispatch(CreateProduct({product}));
        }
      }
    });
  }

  applyFilter(filter: string) {
    this.dataSource.filter = filter;
    this.dataSouceCount = this.dataSource.filteredData.length;
  }

  onViewProduct(id: number) {
    if(this.dialog.openDialogs.length === 0 && id !== this.chartPlaceHolder) {
    this.openDialog(this.productsList().find((product) => product.orderNumber === id), false);
    }
  }

}
