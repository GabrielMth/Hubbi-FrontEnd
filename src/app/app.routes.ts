import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'clientes',
    loadComponent: () =>
      import('./components/clientesTable/clientestable.component').then(m => m.ClientesTableComponent),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'kanban',
    loadComponent: () =>
      import('./components/kanbanBoard/kanban-board.component').then(m => m.KanbanBoardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./components/newTask/newtask.component').then(m => m.NewtaskComponent),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'kanban' }
];
