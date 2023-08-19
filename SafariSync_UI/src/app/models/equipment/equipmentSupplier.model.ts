import { Supplier } from "../supplier/supplier.model";

export interface EquipmentSupplier {
  equipmentSupplier_ID: number;
  equipment_ID: number;
  supplier_ID: number;
  supplier?: Supplier;
}