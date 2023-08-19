import { ToolboxEquipment } from "./toolboxEquipment.model";
import { ToolboxStock } from "./toolboxStock.model";

export interface Toolbox {
    toolbox_ID: number;
    toolbox_Name: string;
    toolbox_Description: string;
    toolboxEquipment: ToolboxEquipment[];
    toolboxStock: ToolboxStock[];
  }
  