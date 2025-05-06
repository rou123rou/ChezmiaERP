import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockItem } from '../../models/stock-item.model'; // Ajustez le chemin si nécessaire

// Définir l'interface pour un OrderItemDto (élément de commande)
export interface OrderItemDto {
  stockItem: StockItem | null; // Assurez-vous d'importer StockItem
  quantity: number;
  unitPrice: number;
  itemTotal: number;
  _id?: string;
}

// Définir l'interface pour un CreateOrderDto (DTO de création de commande)
export interface CreateOrderDto {
  client: string; // ID du client
  orderItems: OrderItemDto[];
}

// Définir l'interface pour une Commande (la structure complète de la commande telle qu'elle pourrait exister dans la base de données)
export interface Commande {
  _id?: string; // ID de la commande
  client?: any; // Ou le type de votre client (pourrait être l'interface Client)
  orderItems: OrderItemDto[];
  dateCreation?: Date;
  totalAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string; // <-- Ajout de la propriété status (optionnelle car elle peut être undefined)
  orderDate?: Date; // <-- Ajout de la propriété orderDate (optionnelle car elle peut être undefined)
}

@Injectable({
  providedIn: 'root'
})
export class CommandesService {
  private apiUrl = 'http://localhost:5000/api/orders'; // L'URL de votre API backend pour les commandes

  constructor(private http: HttpClient) { }

  getAllCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.apiUrl);
  }

  getCommandeById(id: string): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: CreateOrderDto): Observable<any> { // La réponse de création peut varier
    return this.http.post(this.apiUrl, order);
  }

  deleteCommande(id: string): Observable<any> { // Nouvelle méthode pour supprimer une commande
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }



  updateCommandeStatus(commandeId: string, newStatus: string): Observable<Commande> {
    const url = `${this.apiUrl}/${commandeId}/status`; // Assurez-vous que cette route existe dans votre backend
    return this.http.put<Commande>(url, { status: newStatus });
  }




  // Vous pouvez ajouter des méthodes pour la mise à jour et la suppression des commandes ici
  // updateCommande(id: string, commande: Commande): Observable<Commande> {
  //   return this.http.put<Commande>(`${this.apiUrl}/${id}`, commande);
  // }

  // deleteCommande(id: string): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${id}`);
  // }
}