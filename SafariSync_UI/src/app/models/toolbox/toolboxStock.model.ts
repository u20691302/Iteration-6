import { Stock } from "../stock/stock.model";

export interface ToolboxStock {
  toolboxStock_ID: number;
  toolbox_ID: number;
  stock_ID: number;
  quantity: number;
  stock?: Stock;
}
