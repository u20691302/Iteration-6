import { Equipment } from "../equipment/equipment.model";

export interface ToolboxEquipment {
  toolboxEquipment_ID: number;
  toolbox_ID: number;
  equipment_ID: number;
  quantity: number;
  equipment?: Equipment;
}