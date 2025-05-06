import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientsComponent } from './pages/clients/clients/clients.component';
import { AuthGuard } from './auth/auth.guard';
import { StocksComponent } from './dashboard/stocks/stocks.component';
import { CommandesComponent } from './pages/commande/commandes/commandes.component';
import { CommandeListComponent } from './pages/commande/commande-list/commande-list/commande-list.component';
import { CommandeDetailComponent } from './pages/commande/commande-detail/commande-detail/commande-detail.component';
import { CreateCommandeComponent } from './pages/commande/create-commande/create-commande/create-commande.component';
import { CategoriesComponent } from './pages/categories/categories/categories.component'; // Importez le nouveau composant
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'clients', component: ClientsComponent },
      { path: 'stocks', component: StocksComponent },
      { path: 'categories', component: CategoriesComponent },
      {
        path: 'commandes',
        component: CommandesComponent,
        children: [
          { path: '', component: CommandeListComponent },
          { path: 'list', redirectTo: '', pathMatch: 'full' },
          { path: 'detail/:id', component: CommandeDetailComponent },
          { path: 'create', component: CreateCommandeComponent },
        ],
      },
      { path: '', redirectTo: 'clients', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];