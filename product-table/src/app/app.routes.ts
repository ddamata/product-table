import { Routes } from '@angular/router';
import { ProductTableComponent } from './components/products-table/product-table.component';

export const routes: Routes = [
  {
    path: 'products',
    component: ProductTableComponent,
    data: {scope: 'productsTable'}
  },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
];
