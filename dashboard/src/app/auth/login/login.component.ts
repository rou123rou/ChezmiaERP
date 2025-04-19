import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, NgIf],
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.loading = true;
    this.authService.login({ username: this.username, password: this.password }).subscribe(
      (success) => {
        this.loading = false;
        if (!success) {
          this.errorMessage = 'Identifiants incorrects.';
        }
        // La redirection vers /dashboard est gérée dans AuthService en cas de succès
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'Erreur lors de la connexion.';
        console.error('Erreur de connexion:', error);
      }
    );
  }
}