import { Product } from "./product";

export interface Modal {
  title: string;
  product: Product;
  editMode: boolean;
}
