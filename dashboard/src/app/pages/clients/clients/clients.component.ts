// clients.component.ts
import { Component, OnInit } from '@angular/core';
import { ClientsService } from './clients.service';
import { Client } from '../../../models/client.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule],
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  displayedColumns: string[] = ['nom', 'prenom', 'email', 'telephone', 'adresse', 'actions'];
  isAdding = false;
  isCreatingUser = false;
  editingClient: Client | null = null;
  editingClientAdresse: any = {}; // Propriété pour lier l'adresse
  newUser: Omit<Client, 'id' | '_id' | 'dateCreation' | 'role' | 'isBlocked'> & { password?: string } = { nom: '', prenom: '', email: '', telephone: '', adresse: {}, password: '' };
  newUserAdresse: any = {};
  constructor(private clientsService: ClientsService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientsService.getAllClients().subscribe(
      (clients) => {
        this.clients = clients;
        console.log('Clients chargés:', this.clients);
      },
      (error) => {
        console.error('Erreur lors du chargement des clients:', error);
        this.snackBar.open('Erreur lors du chargement des clients.', 'Fermer', { duration: 3000 });
      }
    );
  }

  addClient(): void {
    this.clientsService.addClient(this.newUser).subscribe(
      (newClient) => {
        this.isCreatingUser = false;
        this.newUser = { nom: '', prenom: '', email: '', telephone: '', adresse: {}, password: '' };
        this.loadClients();
        this.snackBar.open('Client/Utilisateur créé avec succès.', 'Fermer', { duration: 3000 });
      },
      (error) => {
        console.error('Erreur lors de la création du client/utilisateur:', error);
        this.snackBar.open('Erreur lors de la création du client/utilisateur.', 'Fermer', { duration: 5000 });
      }
    );
  }

  deleteClient(id: string | undefined): void {
    if (id && confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientsService.deleteClient(id).subscribe(
        () => {
          this.loadClients();
          this.snackBar.open('Client supprimé avec succès.', 'Fermer', { duration: 3000 });
        },
        (error) => {
          console.error('Erreur lors de la suppression du client:', error);
          this.snackBar.open('Erreur lors de la suppression du client.', 'Fermer', { duration: 5000 });
        }
      );
    }
  }

  startEditClient(client: Client): void {
    this.editingClient = { ...client };
    this.editingClientAdresse = client.adresse ? { ...client.adresse } : {};
    this.isAdding = false;
    this.isCreatingUser = false;
  }

  updateClient(): void {
    if (this.editingClient?._id || this.editingClient?.id) {
      const idToUpdate = this.editingClient._id || this.editingClient.id!;
      this.editingClient.adresse = this.editingClientAdresse;
      this.clientsService.updateClient(idToUpdate, this.editingClient).subscribe(
        (updatedClient) => {
          this.editingClient = null;
          this.editingClientAdresse = {};
          this.loadClients();
          this.snackBar.open('Client mis à jour avec succès.', 'Fermer', { duration: 3000 });
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du client:', error);
          this.snackBar.open('Erreur lors de la mise à jour du client.', 'Fermer', { duration: 5000 });
        }
      );
    }
  }

  blockClient(id: string | undefined): void {
    if (id) {
      this.clientsService.blockClient(id).subscribe(() => {
        this.loadClients();
        this.snackBar.open('Client bloqué.', 'Fermer', { duration: 3000 });
      }, error => {
        console.error('Erreur lors du blocage du client:', error);
        this.snackBar.open('Erreur lors du blocage du client.', 'Fermer', { duration: 3000 });
      });
    }
  }

  unblockClient(id: string | undefined): void {
    if (id) {
      this.clientsService.unblockClient(id).subscribe(() => {
        this.loadClients();
        this.snackBar.open('Client débloqué.', 'Fermer', { duration: 3000 });
      }, error => {
        console.error('Erreur lors du déblocage du client:', error);
        this.snackBar.open('Erreur lors du déblocage du client.', 'Fermer', { duration: 5000 });
      });
    }
  }

  showCreateUserForm(): void {
    this.isCreatingUser = true;
    this.editingClient = null;
    this.editingClientAdresse = {};
  }

  cancelEditClient(): void {
    this.editingClient = null;
    this.editingClientAdresse = {};
  }
}