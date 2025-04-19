// frontend/src/app/dashboard/stocks/stocks.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { StockItem } from '../../models/stock-item.model';
import { StockService } from './stock.service';
import { BehaviorSubject, catchError, of, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    NgIf,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
})
export class StocksComponent implements OnInit, OnDestroy {
  stockItems$ = new BehaviorSubject<StockItem[]>([]);
  dataSource = new MatTableDataSource<StockItem>([]);
  displayedColumns: string[] = ['name', 'quantity', 'description', 'price', 'totalValue', 'actions'];
  isAdding = false;
  editingItem: StockItem | null = null;
  newStockItem: Omit<StockItem, 'id'> & { price?: number } = { name: '', quantity: 0, price: 0 };
  private stockSubscription?: Subscription;

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.loadStockItems();
  }

  ngOnDestroy(): void {
    this.stockSubscription?.unsubscribe();
  }

  loadStockItems(): void {
    this.stockSubscription = this.stockService.getStock().pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des stocks:', error);
        return of([]);
      })
    ).subscribe(stocks => {
      this.stockItems$.next(stocks);
      this.dataSource.data = stocks;
      console.log('Data Source:', this.dataSource.data);
    });
  }

  addStockItem(): void {
    this.stockService.addStockItem(this.newStockItem as Omit<StockItem, 'id'>).subscribe(
      (newStock) => {
        this.isAdding = false;
        this.newStockItem = { name: '', quantity: 0, price: 0 };
        this.loadStockItems();
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du stock:', error);
      }
    );
  }

  deleteStockItem(id: string | undefined): void {
    if (id) {
      this.stockService.deleteStockItem(id).subscribe(
        () => {
          console.log('Stock supprimé:', id);
          this.loadStockItems();
        },
        (error) => {
          console.error('Erreur lors de la suppression du stock:', error);
        }
      );
    } else {
      console.error('ID de stock non défini pour la suppression.');
    }
  }

  editStockItem(item: StockItem): void {
    this.editingItem = { ...item };
    this.isAdding = false;
    console.log('Editing Item:', this.editingItem);
  }

  updateStockItem(): void {
    if (this.editingItem?.id) {
      console.log('Updating Item:', this.editingItem);
      this.stockService.updateStockItem(this.editingItem).subscribe(
        (updatedStock) => {
          this.editingItem = null;
          this.loadStockItems();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du stock:', error);
        }
      );
    } else {
      console.error('Impossible de mettre à jour : ID de stock non défini.');
    }
  }

  getTotalValue(item: StockItem): number {
    return item.price != null ? item.price * item.quantity : 0;
  }
}