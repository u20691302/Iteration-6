import { SupplierType } from "./supplierType.model";

export interface Supplier {
  supplier_ID: number;
  supplier_Name: string;
  supplier_Phone_Number: string;
  supplier_Email_Address: string;
  supplier_Address: string;
  supplierType_ID: number;
  supplierType?: SupplierType;
}