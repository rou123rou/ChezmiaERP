// create-commande.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { StockService } from '../../../../dashboard/stocks/stock.service';
import { ClientsService, Client } from '../../../../pages/clients/clients/clients.service';
import { CommandesService } from '../../../commande/commandes.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { StockItem } from '../../../../models/stock-item.model';

interface OrderItemForm {
  stockItem: string;
  quantity: number;
  unitPrice?: number;
  itemTotal?: number;
}

@Component({
  selector: 'app-create-commande',
  templateUrl: './create-commande.component.html',
  styleUrls: ['./create-commande.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatCardModule],
})
export class CreateCommandeComponent implements OnInit {
  commandeForm: FormGroup;
  stockItems: StockItem[] = [];
  clients: Client[] = [];
  orderConfirmation: any;
  selectedClient: any;
  totalAmount: number = 0;

  get orderItemsArray(): FormArray {
    return this.commandeForm.get('orderItems') as FormArray;
  }
  get clientControl(): FormControl {
    return this.commandeForm.controls['client'] as FormControl;
  }
  constructor(
    private fb: FormBuilder,
    private stockService: StockService,
    private clientsService: ClientsService,
    private commandesService: CommandesService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.commandeForm = this.fb.group({
      client: ['', Validators.required],
      orderItems: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadStockItems();
    this.loadClients();
    this.addOrderItem(); // Initialize with one order item
  }

  loadStockItems(): void {
    this.stockService.getAllStockItems().subscribe({
      next: (items) => {
        this.stockItems = items;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stocks:', error);
        this.snackBar.open('Erreur lors du chargement des stocks.', 'Fermer', { duration: 3000 });
      }
    });
  }

  loadClients(): void {
    this.clientsService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients:', error);
        this.snackBar.open('Erreur lors du chargement des clients.', 'Fermer', { duration: 3000 });
      }
    });
  }

  onClientSelected(clientId: string): void {
    this.selectedClient = this.clients.find(client => client._id === clientId || client.id === clientId) || null;
    this.commandeForm.patchValue({ client: clientId }); // Assurez-vous que l'ID est bien patché dans le formulaire
  }

  orderItems(): FormArray {
    return this.commandeForm.get('orderItems') as FormArray;
  }

  newOrderItem(): FormGroup {
    return this.fb.group({
      stockItem: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0],
      itemTotal: [0]
    });
  }

  addOrderItem(): void {
    this.orderItems().push(this.newOrderItem());
  }

  removeOrderItem(index: number): void {
    this.orderItems().removeAt(index);
    this.calculateTotalAmount();
  }

  updateItemTotal(index: number): void {
    const itemGroup = this.orderItemsArray.controls[index] as FormGroup;
    // ... le reste de votre logique pour updateItemTotal en utilisant itemGroup
    const selectedStockItemId = itemGroup.get('stockItem')?.value;
    const quantity = itemGroup.get('quantity')?.value;
    const selectedStockItem = this.stockItems.find(item => item.id === selectedStockItemId);
  
    if (selectedStockItem) {
      itemGroup.patchValue({
        unitPrice: selectedStockItem.price !== undefined ? selectedStockItem.price : 0,
        itemTotal: quantity * (selectedStockItem.price !== undefined ? selectedStockItem.price : 0)
      });
      this.calculateTotalAmount();
    } else {
      itemGroup.patchValue({
        unitPrice: 0,
        itemTotal: 0
      });
      this.calculateTotalAmount();
    }
  }

  calculateTotalAmount(): void {
    this.totalAmount = this.orderItems().controls.reduce((sum, item) => sum + (item.get('itemTotal')?.value || 0), 0);
  }

  isOrderItemInvalid(): boolean {
    return this.orderItems().controls.some(control => control.invalid);
  }

  submitOrder(): void {
    if (this.commandeForm.valid && this.selectedClient && this.orderItems().length > 0 && !this.isOrderItemInvalid()) {
      const orderItems = this.commandeForm.value.orderItems.map((item: any) => ({
        stockItem: item.stockItem,
        quantity: item.quantity,
      }));

      const createOrderDto = {
        client: this.commandeForm.value.client,
        orderItems: orderItems,
        totalAmount: this.totalAmount
      };

      this.commandesService.createOrder(createOrderDto).subscribe({
        next: (response) => {
          this.orderConfirmation = response;
          this.snackBar.open('Commande créée avec succès.', 'Fermer', { duration: 3000 });
          this.router.navigate(['/dashboard/commandes/list']);
        },
        error: (error) => {
          console.error('Erreur lors de la création de la commande:', error);
          this.snackBar.open('Erreur lors de la création de la commande.', 'Fermer', { duration: 5000 });
        }
      });
    } else {
      this.snackBar.open('Veuillez sélectionner un client et ajouter des articles valides à la commande.', 'Fermer', { duration: 3000 });
    }
  }
}