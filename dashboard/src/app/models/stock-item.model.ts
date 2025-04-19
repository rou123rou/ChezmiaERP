// frontend/src/app/models/stock-item.model.ts
export interface StockItem {
  id?: string;
  name: string;
  quantity: number;
  description?: string;
  price?: number;
  totalValue?: number;
}