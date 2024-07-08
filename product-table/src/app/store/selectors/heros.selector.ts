import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "../reducers";
import * as reducer from "../reducers/product.reducers"

export const getMainState = createFeatureSelector<AppState>('main');
export const getProductsState = createSelector(
  getMainState,
  state => state.products
);

export const getProducts = createSelector(
  getProductsState,
  reducer.selectAll,
);
