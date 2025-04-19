import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router, RouterOutlet } from '@angular/router'; // Importez RouterOutlet
import { NavigationComponent } from '../shared/components/navigation/navigation.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [
    NavigationComponent,
    RouterOutlet, // Ajoutez RouterOutlet aux imports
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class DashboardComponent {
  constructor(private authService: AuthService, private router: Router) {}
}