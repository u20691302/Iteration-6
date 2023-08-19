import { Supplier } from "../supplier/supplier.model";
import { StockSupplier } from "./stockSupplier.model";

export interface Stock {
    stock_ID: number;
    stock_Name: string;
    stock_Description: string;
    stock_Quantity_On_Hand: number;
    stock_Low_Level_Warning: number;
    stockSupplier?: StockSupplier[];
    suppliers?: Supplier[];
  }