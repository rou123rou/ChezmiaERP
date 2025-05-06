// src/app/pages/commande/commande-list/commande-list/commande-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommandesService, Commande } from '../../../commande/commandes.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-commande-list',
  templateUrl: './commande-list.component.html',
  styleUrls: ['./commande-list.component.css'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, DatePipe, MatFormFieldModule, MatSelectModule, FormsModule],
})
export class CommandeListComponent implements OnInit {
  commandes: Commande[] = [];
  dataSource: MatTableDataSource<Commande> = new MatTableDataSource<Commande>([]);
  displayedColumns: string[] = ['_id', 'clientName', 'orderDate', 'totalAmount', 'status', 'actions'];

  constructor(
    private commandesService: CommandesService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.commandesService.getAllCommandes().subscribe({
      next: (commandes) => {
        this.commandes = commandes;
        this.dataSource = new MatTableDataSource(this.commandes); // Initialisation de dataSource
        console.log('Commandes chargées:', this.commandes);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des commandes:', error);
        this.snackBar.open('Erreur lors du chargement des commandes.', 'Fermer', { duration: 5000 });
      }
    });
  }

  getClientName(commande: Commande): string {
    return commande.client ? `${commande.client.nom} ${commande.client.prenom || ''}` : 'N/A';
  }

  viewDetails(commandeId: string): void {
    this.router.navigate(['/dashboard/commandes/detail', commandeId]);
  }

  createCommande(): void {
    this.router.navigate(['/dashboard/commandes/create']);
  }

  deleteCommande(commandeId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.commandesService.deleteCommande(commandeId).subscribe({
        next: () => {
          this.snackBar.open('Commande supprimée avec succès.', 'Fermer', { duration: 3000 });
          this.loadCommandes();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la commande:', error);
          this.snackBar.open('Erreur lors de la suppression de la commande.', 'Fermer', { duration: 5000 });
        }
      });
    }
  }

  updateCommandeStatus(commandeId: string, newStatus: string): void {
    this.commandesService.updateCommandeStatus(commandeId, newStatus).subscribe({
      next: (updatedCommande) => {
        this.snackBar.open(`Statut de la commande ${commandeId} mis à jour à ${newStatus}.`, 'Fermer', { duration: 3000 });
        this.loadCommandes(); // Rechargez la liste pour afficher le statut mis à jour
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut de la commande:', error);
        this.snackBar.open('Erreur lors de la mise à jour du statut de la commande.', 'Fermer', { duration: 5000 });
        this.loadCommandes(); // Rechargez la liste pour rétablir l'ancien statut en cas d'échec
      }
    });
  }
}