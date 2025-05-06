// frontend/src/app/models/stock-item.model.ts
export interface StockItem {
  id?: string;
  name: string;
  quantity: number;
  description?: string;
  price?: number;
  // totalValue?: number; // Supprimé car calculé côté backend
  category?: string; // Ajout de la propriété category (l'ID de la catégorie)
}