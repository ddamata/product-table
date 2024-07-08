import {FormControl} from "@angular/forms";

export interface Product {
  status: Status,
  orderNumber: number;
  productLine: string;
  product: string;
  quantity: string;
  dateRequested: Date;
}
export enum Status {
  pending = 'pending', inProgress = 'inProgress', completed = 'completed'
}
export interface SimpleDataModel {
  label: string;
  data: any;
  color?: string;
}

export interface FilterObject {
  [Status.pending]?:  boolean;
  [Status.completed]?:  boolean;
  [Status.inProgress]?:  boolean;
  orderNumber?: number;
  productLine?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
