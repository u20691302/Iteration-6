import { Supplier } from "../supplier/supplier.model";

export interface StockSupplier {
  stockSupplier_ID: number;
  stock_ID: number;
  supplier_ID: number;
  supplier?: Supplier;
}