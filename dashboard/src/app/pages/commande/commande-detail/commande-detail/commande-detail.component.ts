import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommandesService, Commande, OrderItemDto } from '../../../commande/commandes.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-commande-detail',
  templateUrl: './commande-detail.component.html',
  styleUrls: ['./commande-detail.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatListModule, DatePipe],
})
export class CommandeDetailComponent implements OnInit {
  commandeId: string | null = null;
  commande: Commande | null = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commandesService: CommandesService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.commandeId = params.get('id');
      if (this.commandeId) {
        this.loadCommandeDetails(this.commandeId);
      }
    });
  }

  loadCommandeDetails(id: string): void {
    this.commandesService.getCommandeById(id).subscribe({
      next: (commande) => {
        this.commande = commande;
        console.log('Détails de la commande:', this.commande);
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails de la commande:', error);
        this.errorMessage = 'Impossible de charger les détails de la commande.';
        this.commande = null;
        if (error.status === 404) {
          this.errorMessage = 'Commande non trouvée.';
        }
      }
    });
  }

  goBackToCommandes(): void {
    this.router.navigate(['/dashboard/commandes']);
  }

  getProductDisplayName(item: OrderItemDto): string {
    if (item.stockItem && typeof item.stockItem === 'object') {
      return item.stockItem.name;
    } else if (typeof item.stockItem === 'string') {
      return `ID: ${item.stockItem}`;
    } else {
      return 'Non spécifié';
    }
  }
}