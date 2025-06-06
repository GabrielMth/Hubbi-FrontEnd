import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'clientes',
    loadComponent: () =>
      import('./components/ClientsTable/clientestable.component').then(m => m.ClientesTableComponent),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'kanban',
    loadComponent: () =>
      import('./components/kanban-board/kanban-board.component').then(m => m.KanbanBoardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/Login/login.component').then(m => m.LoginComponent)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'kanban' }
];
