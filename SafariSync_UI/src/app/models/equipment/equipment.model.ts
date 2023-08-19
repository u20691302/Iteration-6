import { Supplier } from "../supplier/supplier.model";
import { EquipmentSupplier } from "./equipmentSupplier.model";

export interface Equipment {
    equipment_ID: number;
    equipment_Name: string;
    equipment_Description: string;
    equipment_Quantity_On_Hand: number;
    equipment_Low_Level_Warning: number;
    equipmentSupplier?: EquipmentSupplier[];
    suppliers?: Supplier[];
  }