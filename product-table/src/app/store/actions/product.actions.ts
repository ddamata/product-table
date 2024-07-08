import { createAction, props } from "@ngrx/store";
import { Product } from "../../models";

export enum ProductActionTypes {
  LoadProducts = '[products]: load products',
  CreateProduct = '[products]: create products',
  DeleteProduct = '[products]: delete products',
  UpdateProduct = '[products]: update products',
}
export const LoadProducts = createAction(
  ProductActionTypes.LoadProducts,
  props<{products: Product[] | undefined}>()
);

export const CreateProduct = createAction(
  ProductActionTypes.CreateProduct,
  props<{product: Product | undefined}>()
);

export const DeleteProduct = createAction(
  ProductActionTypes.DeleteProduct,
  props<{id: string | undefined}>()
);

export const UpdateProduct = createAction(
  ProductActionTypes.UpdateProduct,
  props<{product: Product | undefined}>()
);
