import { Component, OnInit } from '@angular/core';
import { ClientsService, Client } from './clients.service';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, MatButtonModule, MatInputModule, MatIconModule, MatListModule, MatCardModule],
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  errorMessage: string = '';
  newClient: Client = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: {
      rue: '',
      ville: '',
      codePostal: '',
      pays: ''
    }
  };
  editingClient: Client | null = null;

  constructor(private clientsService: ClientsService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientsService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la récupération des clients.';
        console.error('Erreur:', error);
      },
    });
  }

  addClient(): void {
    this.clientsService.addClient(this.newClient).subscribe({
      next: (response) => {
        console.log('Client ajouté avec succès:', response);
        this.newClient = {
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          adresse: {
            rue: '',
            ville: '',
            codePostal: '',
            pays: ''
          }
        };
        this.loadClients();
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de l\'ajout du client.';
        console.error('Erreur:', error);
      },
    });
  }

  deleteClient(id: string | undefined): void {
    if (id) {
      this.clientsService.deleteClient(id).subscribe({
        next: (response) => {
          console.log('Client supprimé avec succès:', response);
          this.loadClients();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression du client.';
          console.error('Erreur:', error);
        },
      });
    } else {
      console.error('L\'ID du client à supprimer est indéfini.');
    }
  }

  editClient(client: Client): void {
    this.editingClient = { ...client };
  }

  cancelEdit(): void {
    this.editingClient = null;
  }

  updateClient(): void {
    if (this.editingClient && this.editingClient._id) {
      this.clientsService.updateClient(this.editingClient._id, this.editingClient).subscribe({
        next: (response) => {
          console.log('Client mis à jour avec succès:', response);
          this.editingClient = null;
          this.loadClients();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la mise à jour du client.';
          console.error('Erreur:', error);
        },
      });
    } else {
      console.error('Impossible de mettre à jour le client : ID manquant.');
    }
  }
}