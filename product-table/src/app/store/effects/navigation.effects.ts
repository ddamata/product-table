import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Store } from "@ngrx/store";
import { filter, switchMap, tap } from 'rxjs';
import { DataServiceService } from '../../services/data-service.service';
import { LoadProducts } from '../actions/product.actions';
import {isPlatformBrowser} from "@angular/common";

@Injectable()
export class NavigationEffects {
  isPlatFormBrowser
  onNavigateToMain$  =  createEffect(() =>
  this.actions$.pipe(
    ofType(ROUTER_NAVIGATION),
    filter(({payload}: any) => payload?.routerState?.data?.scope === 'productsTable' && this.isPlatFormBrowser),
    switchMap((action) => this.dataService.loadData()
    .pipe(
      tap((responce) => {
        const heros = localStorage.getItem('products');
        if (heros && (JSON.parse(heros) as unknown as Array<any>)?.length > 0) {
         this.store.dispatch(LoadProducts({products: JSON.parse(heros)}));
        } else {
          localStorage.setItem('products', JSON.stringify(responce));
          this.store.dispatch(LoadProducts({products:responce}));
        }
      })
      )
    )
  ),
  { dispatch: false }
  );

  constructor(private actions$: Actions,
              private store: Store,
              private dataService: DataServiceService,
              @Inject(PLATFORM_ID) platformId: Object) {
      this.isPlatFormBrowser = isPlatformBrowser(platformId);
  }
}
