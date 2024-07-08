import { ApplicationConfig, Injectable, importProvidersFrom } from '@angular/core';
import { RouterState, RouterStateSnapshot, provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideEffects } from '@ngrx/effects';
import { provideStore, provideState } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';
import { effects } from './store/effects';
import { reducers } from './store/reducers';
import { RouterStateSerializer, provideRouterStore } from '@ngrx/router-store';
import * as productsReducer from './store/reducers/product.reducers'
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export interface RouterStateUrl {
  url: string ;
  params: any;
  queryParams: any;
  data: any
}

@Injectable()
export class CustomReouterStateSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;
    let params = {};
    let data = {};
    let parentUrl = '';
    let urlWithoutWueryParams = '';
    while(route.firstChild) {
      route.firstChild.url.map((childUrl) => {
        urlWithoutWueryParams += `/${childUrl.path}`
        return childUrl;
      })
      .filter(() => !!route.firstChild?.firstChild)
      .map((childUrl) => { parentUrl += `/${childUrl.path}`});
      params = {...route.params, ...route.firstChild.params };
      data = {...route.data, ...route.firstChild.data};
      route = route.firstChild;
    }
    data = {...data, parentUrl: parentUrl, urlWithoutWueryParams: urlWithoutWueryParams};
    const {url, root: {queryParams}} = routerState;
    return {url, params, queryParams, data}
  }

}

export const appConfig: ApplicationConfig = {
  providers: [
    provideState('main', reducers, {
      initialState: {
        products: productsReducer.initialState
        }}),
    provideRouter(routes,  withComponentInputBinding()),
    provideEffects(effects),
    provideStore(undefined, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    provideRouterStore({
      serializer: CustomReouterStateSerializer,
    }),
    importProvidersFrom([BrowserAnimationsModule]),
    provideHttpClient(),
    { provide: RouterStateSerializer, useClass: CustomReouterStateSerializer}
  ]
};
