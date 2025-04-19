// frontend/src/app/dashboard/stocks/stock.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockItem } from '../../models/stock-item.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = 'http://localhost:5000/api/stocks';

  constructor(private http: HttpClient) {}

  getStock(): Observable<StockItem[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(stocks => stocks.map(stock => ({
        id: stock._id,
        name: stock.name,
        quantity: stock.quantity,
        description: stock.description,
        price: stock.price,
        totalValue: stock.totalValue,
      })))
    );
  }

  addStockItem(newItem: Omit<StockItem, 'id' | 'totalValue'>): Observable<StockItem> {
    return this.http.post<StockItem>(this.apiUrl, newItem);
  }

  updateStockItem(updatedItem: StockItem): Observable<StockItem> {
    const url = `${this.apiUrl}/${updatedItem.id}`;
    return this.http.put<StockItem>(url, updatedItem);
  }

  deleteStockItem(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}