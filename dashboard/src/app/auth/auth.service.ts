import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  constructor(private router: Router) {
    // Vérifier si localStorage est disponible (environnement navigateur)
    if (typeof window !== 'undefined' && localStorage) {
      // Vérifier si un token est présent au démarrage (pour la persistance simple)
      this.loggedIn.next(!!localStorage.getItem('authToken'));
    }
  }

  login(user: User): Observable<boolean> {
    // Simulation d'une authentification réussie pour 'admin'/'password'
    if (user.username === 'admin' && user.password === 'password') {
      return of(true).pipe(
        delay(1000), // Simuler un délai d'appel API
        tap(() => {
          this.loggedIn.next(true);
          // Vérifier si localStorage est disponible avant de l'utiliser
          if (typeof window !== 'undefined' && localStorage) {
            localStorage.setItem('authToken', 'admin-token'); // Stocker un token simple
          }
          this.router.navigate(['/dashboard']);
        })
      );
    } else {
      return of(false).pipe(delay(1000)); // Échec de l'authentification
    }
  }

  logout(): void {
    this.loggedIn.next(false);
    // Vérifier si localStorage est disponible avant de l'utiliser
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem('authToken');
    }
    this.router.navigate(['/login']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isLoggedIn$;
  }
}