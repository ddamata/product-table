import { RouterReducerState, routerReducer } from "@ngrx/router-store";
import { ActionReducerMap } from "@ngrx/store"
import * as productsReducer from './product.reducers'

export interface AppState {
  products: any
}
export const reducers: ActionReducerMap<AppState> = {
  products: productsReducer.reducer
}
