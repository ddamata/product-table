import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {createReducer, on} from "@ngrx/store";
import {CreateProduct, DeleteProduct, LoadProducts, UpdateProduct} from "../actions/product.actions";
import {Product} from "../../models";


export interface State extends EntityState<Product> {
  selectedUserId: number | null;
  products: Product[]
}

export const adapter: EntityAdapter<Product> = createEntityAdapter<Product>({
  selectId: (hero) => hero.orderNumber,
  sortComparer: sortByTimeStamp,
});

export function sortByTimeStamp(a: Product, b: Product): number {
  if ( a?.dateRequested && b?.dateRequested) {
    const dateA = typeof a?.dateRequested  === 'string' ? new Date(a?.dateRequested) : a.dateRequested;
    const dateB = typeof b?.dateRequested  === 'string' ? new Date(b?.dateRequested) : b.dateRequested;
    return dateA?.getTime() - dateB?.getTime();
  } else if (a?.dateRequested) {
    return -1;
  } else if (b?.dateRequested) {
    return 1;
  } else {
    return 0;
  }
}


export const initialState: State = adapter.getInitialState({
  selectedUserId: null,
  products: []
});

export const reducer = createReducer(
  initialState,
  on(LoadProducts, (state, {products}) => {
    return products ? adapter.addMany(products, state) : state;
  }),
  on(DeleteProduct, (state, {id}) => {
    let newState = id ? adapter.removeOne(id, state) : state;
    localStorage.setItem('products', JSON.stringify(selectAll(newState)));
    return newState;
  }),
  on(UpdateProduct, (state, {product}) =>{
    let newState = product ? adapter.upsertOne(product, state) : state;
    localStorage.setItem('products', JSON.stringify(selectAll(newState)));
    return newState;
  }),
  on(CreateProduct, (state, {product}) =>{
    let newState = product ? adapter.addOne({...product, dateRequested: new Date()}, state) : state;
    localStorage.setItem('products', JSON.stringify(selectAll(newState)));
    return newState;
  }),
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
