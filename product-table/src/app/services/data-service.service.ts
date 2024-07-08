import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//import fs from 'fs';
//import { promisify } from 'node:util';
//import { writeFile } from 'node:fs';
import { catchError, of } from 'rxjs';
import { Product } from '../models';
import { Store } from '@ngrx/store';
import { getProducts } from '../store/selectors/heros.selector';


@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
 constructor(private http: HttpClient,private store: Store) { }
  loadData() {
    return this.http
    .get<Product[]>(`assets/data/data.json`)
    .pipe(catchError(() => of(undefined)));
  }
}
