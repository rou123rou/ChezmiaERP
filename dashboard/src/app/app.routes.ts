import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientsComponent } from './pages/clients/clients/clients.component';
import {AuthGuard} from './auth/auth.guard';
import { StocksComponent } from './dashboard/stocks/stocks.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard], // Protéger la route du dashboard
    children: [
      { path: 'clients', component: ClientsComponent },
      { path: 'stocks', component: StocksComponent },
      // Ici, vous ajouterez d'autres routes pour les composants de votre tableau de bord
      { path: '', redirectTo: 'clients', pathMatch: 'full' }, // Rediriger vers la page clients par défaut
    ],
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Rediriger la racine vers le dashboard (si connecté)
  { path: '**', redirectTo: '/dashboard' }, // Rediriger toute autre route inconnue
];