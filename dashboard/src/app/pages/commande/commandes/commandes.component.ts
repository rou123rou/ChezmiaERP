import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-commandes',
  template: '<router-outlet></router-outlet>', // Ceci est un conteneur pour les composants enfants (liste, détail, création)
  standalone: true,
  imports: [
    // Importez CommonModule si vous utilisez des directives structurelles dans le template futur
    RouterOutlet, // <-- Ajoutez RouterOutlet ici
  ],
})
export class CommandesComponent {
}