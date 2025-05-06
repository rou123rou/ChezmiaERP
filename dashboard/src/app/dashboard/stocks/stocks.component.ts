// frontend/src/app/modules/dashboard/stocks/stocks.component.ts
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
import { MatSelectModule } from '@angular/material/select'; // Pour la catégorie
import { Category } from '../../models/category.model'; // Assurez-vous d'avoir ce modèle
import { CategoryService } from '../../services/category.service'// Créez ce service

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
    MatSelectModule,
  ],
})
export class StocksComponent implements OnInit, OnDestroy {
  stockItems$ = new BehaviorSubject<StockItem[]>([]);
  dataSource = new MatTableDataSource<StockItem>([]);
  displayedColumns: string[] = ['name', 'quantity', 'price', 'category', 'actions']; // Mise à jour des colonnes
  isAdding = false;
  editingItem: StockItem | null = null;
  newStockItem: Omit<StockItem, 'id'> & { price?: number; category?: string } = { name: '', quantity: 0, price: 0, category: '' };
  categories: Category[] = [];
  



  
  private stockSubscription?: Subscription;
  private categorySubscription?: Subscription;

  constructor(private stockService: StockService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadStockItems();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.stockSubscription?.unsubscribe();
    this.categorySubscription?.unsubscribe();
  }

  loadCategories(): void {
    this.categorySubscription = this.categoryService.getAllCategories().pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des catégories:', error);
        return of([]);
      })
    ).subscribe(categories => {
      this.categories = categories;
    });
  }

  loadStockItems(): void {
    this.stockSubscription = this.stockService.getAllStockItems().pipe(
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
        this.newStockItem = { name: '', quantity: 0, price: 0, category: '' };
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

  getCategoryName(categoryId: string | undefined): string {
    const category = this.categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Non défini';
  }
}